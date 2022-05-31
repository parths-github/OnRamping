// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract KeyRegistry
{
    mapping (address => bytes) private keys;
    
    function getKey(address a) public view returns (bytes)
    {
        if(keys[a] == 0x0)
            revert("Error: Unknown address");
            
        return keys[a];
    }
    
    function setKey(bytes key) public returns (address)
    {
        if(key.length == 0)
            revert("Error: Key cant be empty");
        
        address a = address(uint160(bytes20(key)));
        
        if(a != msg.sender)
            revert("Error: Only the owner of a key can register this key");
        
        if(keys[a] != 0)
            revert("Error: Key is already registered");
        
        keys[a] = key;
        
        return a;
    }
}