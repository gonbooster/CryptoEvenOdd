// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoEvenOdd is Ownable{

    uint public betCost = 5 ether;
    uint private balance;
    uint private randomNonce = 0;
    uint public evenCount=0;
    uint public oddCount=0;
    enum Result { NONE, LOSE, WIN, DRAW }

    struct Bet{
        address participant;
        uint value;
        Result result;
    }

    Bet[] private bets;

    event Winner(Result result, uint award);

    constructor() {
    }


    modifier withoutParticipanting(){
        for(uint i=0; i< bets.length; i++){
            require(msg.sender != bets[i].participant, "you are already participating");
        }
        _;
    }
    

    function makeBet(uint _value) external payable withoutParticipanting(){
        require(msg.value == betCost,"Incorrect amount");
        Bet memory bet;
        bet.participant = msg.sender;
        bet.value = _value;
        bet.result = Result.LOSE;
        bets.push(bet);
        balance = balance + msg.value;

        if(bets.length == 2){
            Bet memory bet1 = bets[0];
            Bet memory bet2 = bets[1];
            delete bets;
        
            transferFeeToOwner(); 

            uint winnersCount = 0;
            uint award = 0;
            uint winnerValue = getPRN(77) % 2;

            if(winnerValue == 1){
                oddCount++;
            }
            else{
                evenCount++;
            }

            if(winnerValue == bet1.value){
                    bet1.result= Result.WIN;
                    winnersCount++;
            }

            if(winnerValue == bet2.value){
                    bet2.result= Result.WIN;
                    winnersCount++;
            }


            if( winnersCount == 0){
                award = balance / 2;
                balance -=  award;
                (bool b1t, ) =  payable(bet1.participant).call{value: award}("");
                require(b1t, "Transfer to participant failed");
                balance -=  award;
                (bool b2t, ) =  payable(bet2.participant).call{value: award}("");
                require(b2t, "Transfer to participant failed");
            }
            else{ 
                award = balance / winnersCount;
                if(bet1.result == Result.WIN){
                    balance -=  award;
                    (bool b1t, ) =  payable(bet1.participant).call{value: award}("");
                    require(b1t, "Transfer to participant failed");
                }
                if(bet2.result == Result.WIN){
                    balance -=  award;
                    (bool b2t, ) =  payable(bet2.participant).call{value: award}("");
                    require(b2t, "Transfer to participant failed");

                }
            }
            
            emit Winner(bet1.participant == msg.sender ? bet1.result : bet2.result, award);
        }
    }


    function transferFeeToOwner() private {   
        uint amount = balance * 2 / 100;
        balance -=  amount;
        (bool os, ) = payable(owner()).call{value: amount}("");
        require(os, "Transfer fee to owner failed");
    }

    function balanceOf() external view onlyOwner returns (uint){
        return balance;
    }

    function setBetCost(uint _newCost) external onlyOwner{
        betCost = _newCost;
    }

     function getPRN(uint256 _module) internal returns (uint256) {
        randomNonce = (randomNonce == ((2**256) - 1)) ? 0 : randomNonce + 1;
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    randomNonce +
                        block.timestamp +
                        block.difficulty +
                        ((
                            uint256(keccak256(abi.encodePacked(block.coinbase)))
                        ) / (block.timestamp)) +
                        block.gaslimit +
                        ((uint256(keccak256(abi.encodePacked(msg.sender)))) /
                            (block.timestamp)) +
                        block.number
                )
            )
        );
        return (seed - ((seed / (1 * 10**(_module))) * (1 * 10**(_module))));
    }
}
