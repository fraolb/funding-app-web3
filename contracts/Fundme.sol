// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

//get fund from user
//withdraw funds
///set minimum funding

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;
    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        //min fund amount
        //how do we send ETH to this contract
        require(
            msg.value.getConversionRate(priceFeed) > MINIMUM_USD,
            "Didnt send enough"
        );
        //msg.value.getConversionRate();

        //reverts?
        //oracle network, chainlink

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdrawFunc() public onlyOwner {
        // require(msg.sender == owner, "sender is Not the owner");
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }

        //reset the array
        funders = new address[](0);

        //withdraw fund
        //send
        //bool sendSucess = payable(msg.sender).send(address(this).balance);
        //require(sendSucess, "Send is Failed");

        //transfer
        //payable(msg.sender) = payable address
        //payable(msg.sender).transfer(address(this).balance);

        //call
        (bool callSucess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSucess, "Call Failed");
    }

    modifier onlyOwner() {
        //require(msg.sender == i_owner, "sender is Not the owner");
        if (msg.sender == i_owner) {
            revert NotOwner();
        }
        _;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
