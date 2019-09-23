import {IrisClient} from "../src"
import {createEvent,EventType} from "../src/constants"
const lcdUrl = "https://rpc.irisnet.org";
//const lcdUrl = "http://192.168.150.31:31317";
const rpcUrl = "irisnet-rpc.dev.rainbow.one";
import {parseRat} from '../src/utils'
import {IrisRouter} from '../src/modules/router-iris'
const chai = require('chai');
const assert = chai.assert;
describe('test modules', function () {
    let client = new IrisClient(lcdUrl,{
        network:"testnet",
        //chain_id: "rainbow-dev",
        chain: "iris",
        timeout:10000,
        fee:{denom: "iris-atto", amount: 600000000000000000},
        gas:10000,
        mode:"sync", //async | commit | sync
    });

    describe('should crypto module', async function() {
        it('should createAccount', function () {
            let crypto = client.getCrypto();
            let account = crypto.create('english');
            assert.isNotNull(account);
        });
        it('should getRouter', function () {
            console.log(JSON.stringify(client))
        });
    });

    describe('should Client',function () {
        it('should custom Provider', async function () {
            let provider = {
                get : (url,opts) =>{
                    console.log(url);
                    return "hello"
                }
            };
            let client2 = new IrisClient(provider);
            let res = await client2.getValidators();
            console.log(res);

            let account = client2.getCrypto().create('english');
            console.log(JSON.stringify(account));

        });
    });

    describe('should bank module', async function() {
        it('should getAccount', async function () {
            let res = await client.getAccount("faa1ljemm0yznz58qxxs8xyak7fashcfxf5lssn6jm");
            assert.isNotNull(res);
        });

        it('should getCoinType', async function () {
            let res = await client.getCoinType("iris");
            assert.isNotNull(res);
        });

        it('should getTokenStats', async function () {
            let res = await client.getTokenStats();
            assert.isNotNull(res);
        });

        it('should simulate transaction', async function () {
            let from = "faa1ljemm0yznz58qxxs8xyak7fashcfxf5lssn6jm";
            let to = "faa1s6v9qgu8ye7d884s8kpye64x66znndg8t6eztj";
            let amount  = [{denom: "iris-atto", amount: 10000000000000000000}];
            let memo = "1";
            let simulate = true;
            let pub_key ="fap1addwnpepqtdme789cpm8zww058ndlhzpwst3s0mxnhdhu5uyps0wjucaufha6v3ce99";

            let result = await client.transfer(from,to,amount,{memo,pub_key,simulate});
            assert.isNotNull(result.resp.gas_estimate);
        });

        it('should transfer', async function () {
            let from = "faa1ljemm0yznz58qxxs8xyak7fashcfxf5lssn6jm";
            let to = "faa1s6v9qgu8ye7d884s8kpye64x66znndg8t6eztj";
            let amount  = [{denom: "iris-atto", amount: 10000000000000000000}];
            let memo = "1";
            let private_key = "55A3160577979EC014A2CE85C430E1FF0FF06EFD230B7CE41AEAE2EF00EDF175";
            let result = await client.transfer(from,to,amount,{memo,private_key});
            assert.equal(result.hash,result.resp.hash)
        });
    });

    describe('should stake module', async function() {
        it('should getValidators', async function () {
            let res = await client.getValidators(1,2);
            assert.isArray(res)
        });

        it('should delegate', async function () {
            let from = "faa1ljemm0yznz58qxxs8xyak7fashcfxf5lssn6jm";
            let to = "fva1x292qss22x4rls6ygr7hhnp0et94vwwrdxhezx";
            let amount  = {denom: "iris-atto", amount: 10000000000000000000};
            let gas = 30000;
            let fee = {denom: "iris-atto", amount: 600000000000000000};
            let memo = "1";
            let private_key = "55A3160577979EC014A2CE85C430E1FF0FF06EFD230B7CE41AEAE2EF00EDF175";

            let result = await client.delegate(from,to,amount,{fee,gas,memo,private_key});
            assert.equal(result.hash,result.resp.hash)
        });
    });

    describe('should Distr module', async function() {
        it('should getWithdrawAddr', async function () {
            let res = await client.getWithdrawAddr("faa10xj3gsy6zfje94x7gu8mxxas08a9ugcn4n3v5m");
            assert.isNotNull(res);
        });

        it('should queryRewards', async function () {
            let res = await client.queryRewards("faa10xj3gsy6zfje94x7gu8mxxas08a9ugcn4n3v5m");
            assert.isNotNull(res);
        });

        it('should getCommunityTax', async function () {
            let res = await client.getCommunityTax();
            assert.isNotNull(res);
        });

        it('should withdrawAllRewards', async function () {
            let from = "faa1ljemm0yznz58qxxs8xyak7fashcfxf5lssn6jm";
            let gas = 30000;
            let fee = {denom: "iris-atto", amount: 600000000000000000};
            let memo = "1";
            let private_key = "55A3160577979EC014A2CE85C430E1FF0FF06EFD230B7CE41AEAE2EF00EDF175";

            let result = await client.withdrawAllRewards(from,{fee,gas,memo,private_key});
            assert.equal(result.hash,result.resp.hash)
        });
    });

    describe('should tm module', async function() {
        it('should getNodeInfo', async function () {
            let res = await client.getNodeInfo();
            assert.isNotNull(res);
        });

        it('should getSyncing', async function () {
            let res = await client.getSyncing();
            assert.isNotNull(res);
        });

        it('should getBlock', async function () {
            let res = await client.getBlock();
            assert.isNotNull(res);
        });

        it('should getBlockResult', async function () {
            let res = await client.getBlockResult();
            assert.isNotNull(res);
        });

        it('should getValidatorSet', async function () {
            let res = await client.getValidatorSet();
            assert.isNotNull(res);
        });

        it('should getTx', async function () {
            let res = await client.getTx("1FC77F5A871D6F16DF194D150AFE203F645D57E4A8D81B61D8737E5CF0D68F9B");
            assert.isNotNull(res);
        });
    });

    describe('should version module', async function() {
        it('should getLcdVersion', async function () {
            let res = await client.getLcdVersion();
            assert.isNotNull(res);
        });

        it('should getNodeVersion', async function () {
            let res = await client.getNodeVersion();
            assert.isNotNull(res);
        });
    });

    describe('should slashing module', async function() {
        it('should getSigningInfo', async function () {
            let res = await client.getSigningInfo("fcp1zcjduepqevwqk73gun8pp59wz6raddnsg2fczvs237cefl9ve7f94feh6lzsdr4qrf");
            assert.isNotNull(res);
        });
    });

    describe('should gov module', async function() {
        it('should getProposals', async function () {
            let res = await client.getProposals(null,null,"Rejected");
            assert.isNotNull(res);
        });
        it('should getProposal', async function () {
            let res = await client.getProposal(3);
            assert.isNotNull(res);
        });
        it('should getDeposits', async function () {
            let res = await client.getDeposits(3);
            assert.isNotNull(res);
        });
        it('should getDeposit', async function () {
            let res = await client.getDeposit(3,'faa10xj3gsy6zfje94x7gu8mxxas08a9ugcn4n3v5m');
            assert.isNotNull(res);
        });
        it('should getVotes', async function () {
            let res = await client.getVotes(3);
            assert.isNotNull(res);
        });
        it('should getVote', async function () {
            let res = await client.getVote(3,'');
            assert.isNotNull(res);
        });
        it('should getParams', async function () {
            let res = await client.getParams("stake");
            assert.isNotNull(res);
        });
    });

    describe('should rpc', async function() {
        it('should status', async function () {
            let client2 = client.clone(rpcUrl);
            let res = await client2.status();
            assert.isNotNull(res);

            let res1 = await client2.getTx("1FC77F5A871D6F16DF194D150AFE203F645D57E4A8D81B61D8737E5CF0D68F9B");
            assert.isNotNull(res1);
        });

        it('should block', async function () {
            client.clone(rpcUrl);
            let res = await client.block({height:100});
            assert.isNotNull(res);
        });
    });

    // describe('should ws', function () {
    //     this.timeout(10000);
    //     it("should subscribe", async function(){
    //         let wsClient = client.clone(`ws://${rpcUrl}`);
    //         await new Promise(() => {
    //             let event = createEvent(EventType.NewBlock);
    //             wsClient.subscribe(event, (events) => {
    //                 console.log(JSON.stringify(events));
    //             })
    //         })
    //     });
    // });

    describe('should coinswap', function () {

        let config = {
            gas:20000, private_key:"80D45E1FAB9ACF59254F23C376E3AEAF139C847CD7A3126CDFD5216568730C90"
        };
        let sender = "faa1f3vflz39qr5sjzfkqmkzkr5dy7t646wyexy92y";
        let deadline = new Date().getTime();

        it('should addLiquidity', async function () {
            let maxToken = {
                denom: "bny-min",
                amount: "10000000000000000000000"
            };
            let exactIrisAmt = "200000000000000000000000";
            let minLiquidity = "100000000000000000";
            let result = await client.addLiquidity(maxToken,exactIrisAmt,minLiquidity,deadline,sender,config);
            console.log(JSON.stringify(result));
        });

        it('should removeLiquidity',async function () {
            let min_token = "1";
            let withdrawLiquidity = {
                denom: "u-btc-min",
                amount: "10000000000000000000000"
            };
            let minIrisAmt = "10000000000000000";
            let result = await client.removeLiquidity(min_token,withdrawLiquidity,minIrisAmt,deadline,"faa1f3vflz39qr5sjzfkqmkzkr5dy7t646wyexy92y",config);
            console.log(JSON.stringify(result));
        });

        it('should swap', async function () {
            let input = {
                address:sender,
                coin:{
                    denom: "iris-atto",
                    amount: "10000000000000000000000000000000"
                },
            };
            let output = {
                address:"faa1hf8hg62fy9wttj9rar6xlmygnukwtg3zx5qxa5",
                coin:{
                    denom: "btc-min",
                    amount: "1"
                },
            };
            let is_buy_order = true;
            let result = await client.swap(input,output,deadline,is_buy_order,config);
            console.log(JSON.stringify(result));
        });

        it('should getReservePool', async function () {
            let pool = await client.getReservePool("u-btc");
            console.log(JSON.stringify(pool));
        });

        it('should tradeExactIrisForTokens', async function () {
            let amt = await client.tradeExactIrisForTokens("u-bny",30000000000000000000);
            console.log(amt/1000000000000000000);
        });
        it('should tradeIrisForExactTokens', async function () {
            let amt = await client.tradeIrisForExactTokens("u-bny",5);
            console.log(amt.toString());
        });
        it('should tradeExactTokensForIris', async function () {
            let amt = await client.tradeExactTokensForIris("u-bny",2000000000000000000);
            console.log(amt.toString());
        });
        it('should tradeTokensForExactIris', async function () {
            let amt = await client.tradeTokensForExactIris("u-bny",100000000000000000000);
            console.log(amt.toString());
        });

        it('should tradeExactTokensForTokens', async function () {
            let amt = await client.tradeExactTokensForTokens("u-bny","u-btc",100000000000000000000);
            console.log(amt.toString());
        });
    });

    describe('should asset', function () {
        it("should getToken", async function(){
            let token = await client.getToken("axon");
            assert.isNotNull(token);
        });

        it("should getTokens", async function(){
            let token = await client.getTokens("native","","");
            assert.isNotNull(token);
        });

        it("should getGateway", async function(){
            let token = await client.getGateway("sss");
            assert.isNull(token);
        });

        it("should getGateways", async function(){
            let token = await client.getGateways();
            assert.isNotNull(token);
        });

        it("should getGatewayFee", async function(){
            let token = await client.getGatewayFee("");
            assert.isNotNull(token);
        });

        it("should getTokenFee", async function(){
            let token = await client.getTokenFee("axon");
            assert.isNotNull(token);
        });
    });
});
