// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


//Deployed to Goerli: 0xb78f9EfeF62E9A32680c9f736ee2EEe871b2fb2B

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BuyMeACoffee is Ownable {

    //Event emmitted when Memo is created
    event NewMemo(
        address from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of memos
    Memo[] memos;

    //Address of withdraw address
    address payable withdraw;

    //Deploy logic
    constructor() {
        withdraw = payable(msg.sender);
    }

    /**
    * @dev buy a coffee for contract owner
    * @param _name name of the coffee buyer
    * @param _message a nice message from the coffee buyer
    */
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "0 ETH???");

        //add memo to storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //emit log event when new memo created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
    * @dev send balance of contract to owner
    */
    function withdrawTips() public {
        withdraw.transfer(address(this).balance);   
    }

    /**
    * @dev get memos stored
    */
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }

    /**
     * @dev change withdrawl address
     * @param _withdraw new withdrawl address
     */
     function changeWithdraw(address payable _withdraw) public onlyOwner {
        withdraw = _withdraw;
     }

    /**
     * @dev returns amount of tips stored in contract
     * @return tips amount of tips
     */
    function getTips() public view returns(uint256) {
        return address(this).balance;
    }
}

