// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
import "hardhat/console.sol";

error FundMe__NotOwner();

/// @title A contract for crowd funding
contract FundMe {
    using PriceConverter for uint256;
    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public s_funders;
    mapping(address => uint256) public s_addressToAmountFunded;

    address public immutable i_owner;

    AggregatorV3Interface public s_priceFeed;

    modifier onlyOwner() {
        //require(msg.sender == i_owner, "sender is Not the owner");
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        //min fund amount
        //how do we send ETH to this contract
        //const convRate = getConversionRate(msg.value, priceFeed);

        console.log("the sent amount is ", msg.value);
        console.log(
            "the conversion amount is ",
            msg.value.getConversionRate(s_priceFeed)
        );
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Didnt send enough"
        );
        //msg.value.getConversionRate();

        //reverts?
        //oracle network, chainlink

        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdrawFunc() public onlyOwner {
        // require(msg.sender == owner, "sender is Not the owner");
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        //reset the array
        s_funders = new address[](0);

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

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);
        (bool callSucess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSucess, "Call Failed");
    }
}
