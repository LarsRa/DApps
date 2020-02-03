pragma solidity >=0.4.21 <0.7.0;

import "./SafeMath.sol";

contract Bank {
  mapping(address => uint256) balance;
  mapping(address => bool) locked;
  
  address owner;
  
  using SafeMath for uint256;
  
  modifier onlyOwner(){
      require(msg.sender == owner, "User is not the owner of the contract!");
      _;
  }
  
  modifier unlocked(){
      require(!locked [msg.sender], "User is locked!");
      _;
  }
  
  modifier liquid(uint _amount){
      require(balance[msg.sender] >= _amount && _amount > 0, "Not enough money!");
      _;
  }
  
  constructor() public {
      owner = msg.sender;
  }
  
  function lockUser(address _user) external onlyOwner{
      locked[_user] = true;
  }
  
  function unlockUser(address _user) external onlyOwner{
      locked[_user] = false;
  }
  
  function getBalance()external view returns(uint256){
      return balance[msg.sender];
  }
  
  function sendMoney(address _to, uint _amount) external unlocked liquid(_amount){
      require(msg.sender != address(0) && msg.sender != _to, "Invalid address");
      balance[msg.sender] = balance[msg.sender].sub(_amount);
      balance[_to] = balance[_to].add(_amount);
  }
  
  function deposit() external payable unlocked{
      balance[msg.sender] = balance[msg.sender].add(msg.value);
  }
  
  function withdraw(uint _amount) external unlocked liquid(_amount){
      msg.sender.transfer(_amount);
      balance[msg.sender] = balance[msg.sender] - _amount;
  }
}
