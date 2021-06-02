import * as anchor from '@project-serum/anchor';
import { assert } from 'chai'


describe('basic', () => {

  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Manager;
  const myAccount = anchor.web3.Keypair.generate();

  it('Initialization', async () => {
    await program.rpc.initialize(new anchor.BN(42), {
      accounts: {
        user: myAccount.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [myAccount],
      instructions: [await program.account.myAccount.createInstruction(myAccount)],
    });
  });


  it('Update', async () => {
    await program.rpc.update(new anchor.BN(44), {
      accounts: {
        user: myAccount.publicKey
      }
    });
  });

  it(('CountInit'), async () => {
    await program.state.rpc.new({
      accounts: {
        authority: anchor.Provider.env().wallet.publicKey,
      },
    });

    const {count} = await program.state.fetch()
    assert.ok(count.eq(new anchor.BN(0)))
  })

  it(('Counter'), async () => {

    let expectedCount = Math.floor(Math.random() * 10+2)

    for(let i = 0; i < expectedCount; i++){
      await program.state.rpc.increment({
        accounts: {
          authority: anchor.Provider.env().wallet.publicKey,
        },
      });
    }

    const {count} = await program.state.fetch()
    assert.ok(count.eq(new anchor.BN(expectedCount)))
  })
});
