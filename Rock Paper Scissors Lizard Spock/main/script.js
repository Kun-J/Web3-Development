/*const { ContractFactory } = require("ethers");*/
const forwarderOrigin = 'http://127.0.0.1:5500/RPS/index.html';
let connected = 0;
let create = 0;
let join = 0;

const initialize = () => {
    const connectButton = document.getElementById('metamask');
    const { ethereum } = window;
  
    const onboardMetaMaskClient = async () => {
        if (!isMetamaskInstalled()) {
              console.log("MetaMask is not installed :(");
              connectButton.value = "Click here to install metamask";
              connectButton.onclick = installMetaMask;
        } else {
              console.log("MetaMask is installed Hurray!!!!!");
              connectButton.onclick = connectMetaMask;
        }
    }
  
    const connectMetaMask = async () => {
        connectButton.disabled = true;
            try {
              const accounts = await ethereum.request({ method: "eth_requestAccounts" });
              connectButton.value = "Connected";
              console.log("accounts: ", accounts);
              connectButton.disabled = false;
              connectButton.innerText = 'Metamask Connected';
              connected = 1;
            } catch (err) {
              console.error("error occured while connecting to MetaMask: ", err)
            }
    }
  
    const isMetamaskInstalled = () => {
        return ethereum && ethereum.isMetaMask;
    }
  
    const installMetaMask = () => {
        const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
        connectButton.value = "Installation in progress";
        connectButton.disabled = true;
        onboarding.startOnboarding();
    }
  
    onboardMetaMaskClient();
};

window.addEventListener('DOMContentLoaded', initialize);

  
const buttons = document.querySelectorAll('.pick');
let p1Choice = undefined;
let p2Choice = undefined;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (create == 1){
            p1Choice = button.getAttribute('data-choice');
            console.log(p1Choice);
            main.style.display = 'none';
            selection.style.display = 'flex';
            view = 1;
            updateSelection(p1Select, p1Choice);
        } else if (join == 1){
            p2Choice = button.getAttribute('data-choice');
            console.log(p2Choice);
            main.style.display = 'none';
            selection2.style.display = 'flex';
            document.getElementById('amount2').value = amount;
            document.getElementById('amount2').style.color = '#fff';
            view = 1;
            updateSelection(p2Select, p2Choice);
        } else {
            alert("Please choose a game mode to play");
        }
    });
});

const main = document.getElementById('main');
const selection = document.getElementById('selection');
const selection2 = document.getElementById('selection2');
const p1Select = document.getElementById('p1_select');
const p2Select = document.getElementById('p2_select');

function updateSelection(selectionEl, pChoice) {
    selectionEl.classList.remove('btn-Rock');
    selectionEl.classList.remove('btn-Paper');
    selectionEl.classList.remove('btn-Scissors');
    selectionEl.classList.remove('btn-Lizard');
    selectionEl.classList.remove('btn-Spock');

    selectionEl.classList.add(`btn-${pChoice}`);
    const img = selectionEl.querySelector('img');
    img.src = `./images/icon-${pChoice}.svg`;
    img.alt = pChoice;
}

const openBtn = document.getElementById('open');
const closeBtn = document.getElementById('close');
const modal = document.getElementById('modal');
let view = 0;

openBtn.addEventListener('click', () => {
    if(view == 0) {
        main.style.display = 'none';
        modal.style.display = 'flex';
    } else if (create == 1) {
        modal.style.display = 'flex';
        selection.style.display = 'none';
    } else if (join == 1){
        modal.style.display = 'flex';
        selection2.style.display = 'none';
    }
});

closeBtn.addEventListener('click', () => { 
    if(view == 0) {
        main.style.display = 'flex';
        modal.style.display = 'none';
    } else if (create == 1){
        modal.style.display = 'none';
        selection.style.display = 'flex';
    } else if (join == 1){
        modal.style.display = 'none';
        selection2.style.display = 'flex';
    }
});

const openInstruct = document.getElementById('instruct-open');
const closeInstruct = document.getElementById('instruct-close');
const instructModal = document.getElementById('instruct-modal');

openInstruct.addEventListener('click', () => {    
    if(view == 0) {
        main.style.display = 'none';
        instructModal.style.display = 'flex';
    } else if(create == 1) {
        instructModal.style.display = 'flex';
        selection.style.display = 'none';
    } else if(join == 1) {
        instructModal.style.display = 'flex';
        selection2.style.display = 'none';
    }
});

closeInstruct.addEventListener('click', () => {
    if(view == 0) {
        main.style.display = 'flex';
        instructModal.style.display = 'none';
    } else if (create == 1) {
        instructModal.style.display = 'none';
        selection.style.display = 'flex';
    } else if (join == 1) {
        instructModal.style.display = 'none';
        selection2.style.display = 'flex';
    }
});

const resetBtn = document.getElementById('reset');

resetBtn.addEventListener('click', () => {
    selection.style.display = 'none';
    p1choice = undefined;
    main.style.display = 'flex';
});

const playBtn = document.getElementById('play');
const joinBtn = document.getElementById('join');
const createBtn = document.getElementById('create');

playBtn.addEventListener('click', () => {
    if(connected == 1) {
        playBtn.style.display = 'none';
        joinBtn.style.display = 'flex';
        createBtn.style.display = 'flex';
    } else {
        alert("Please connect your Metamask wallet");
    }
});

createBtn.addEventListener('click', () => {
    if(create == 0) {
        create = 1;
        joinBtn.style.display = 'none';
        createBtn.innerText = 'Game Created';
        document.getElementById('overlay').style.display = 'block';
    }
});

joinBtn.addEventListener('click', () => {
    if(join == 0) {
        join = 1;
        createBtn.style.display = 'none';
        joinBtn.innerText = 'Game Joined';
        document.getElementById('overlay').style.display = 'block';
    }
});

function off() {
    document.getElementById('overlay').style.display = 'none';
    modal.style.display = 'none';
}

const submitBtn = document.getElementById('submit');
const inputs = document.getElementById('inputs');
const waiting = document.getElementById('waiting');
const targetNetworkId = '0x5';



submitBtn.addEventListener('click', async () => {
    document.getElementById('overlay2').style.display = 'block';
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
    let key = document.getElementById('secret').value;
    amount = document.getElementById('amount').value;
    opAddress = document.getElementById('opponent').value;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(accounts[0]);    
    const hashAddress = '0x5C65c232b9C326D031a0AaA9720074954368963c';
    const hashABI = [{
		"constant": true,
		"inputs": [
			{
				"name": "_c",
				"type": "uint8"
			},
			{
				"name": "_salt",
				"type": "uint256"
			}
		],
		"name": "hash",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}]
    const hashContract = new ethers.Contract(hashAddress, hashABI, signer);
        
    const hash = await hashContract.hash(3, key);
    console.log(hash);

    const rpsABI = [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_c1",
                    "type": "uint8"
                },
                {
                    "name": "_c2",
                    "type": "uint8"
                }
            ],
            "name": "win",
            "outputs": [
                {
                    "name": "w",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "j2Timeout",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "stake",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "c2",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "c1Hash",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_c2",
                    "type": "uint8"
                }
            ],
            "name": "play",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "j2",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "lastAction",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_c1",
                    "type": "uint8"
                },
                {
                    "name": "_salt",
                    "type": "uint256"
                }
            ],
            "name": "solve",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "j1",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "j1Timeout",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "TIMEOUT",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "_c1Hash",
                    "type": "bytes32"
                },
                {
                    "name": "_j2",
                    "type": "address"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "constructor"
        }]
    
    const rpsBYTECODE = "608060405261012c600555604051604080610aaf833981018060405281019080805190602001909291908051906020019092919050505034600481905550336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600281600019169055504260068190555050506109ce806100e16000396000f3006080604052600436106100ba576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630c4395b9146100bf578063294914a4146101145780633a4b66f11461012b57806348e257cb146101565780634d03e3d21461018f57806353a04b05146101c257806380985af9146101e557806389f71d531461023c578063a5ddec7c14610267578063c37597c6146102a1578063c8391142146102f8578063f56f48f21461030f575b600080fd5b3480156100cb57600080fd5b506100fa600480360381019080803560ff169060200190929190803560ff16906020019092919050505061033a565b604051808215151515815260200191505060405180910390f35b34801561012057600080fd5b50610129610403565b005b34801561013757600080fd5b506101406104ae565b6040518082815260200191505060405180910390f35b34801561016257600080fd5b5061016b6104b4565b6040518082600581111561017b57fe5b60ff16815260200191505060405180910390f35b34801561019b57600080fd5b506101a46104c7565b60405180826000191660001916815260200191505060405180910390f35b6101e3600480360381019080803560ff1690602001909291905050506104cd565b005b3480156101f157600080fd5b506101fa6105c0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561024857600080fd5b506102516105e6565b6040518082815260200191505060405180910390f35b34801561027357600080fd5b5061029f600480360381019080803560ff169060200190929190803590602001909291905050506105ec565b005b3480156102ad57600080fd5b506102b66108c7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561030457600080fd5b5061030d6108ec565b005b34801561031b57600080fd5b5061032461099c565b6040518082815260200191505060405180910390f35b600081600581111561034857fe5b83600581111561035457fe5b141561036357600090506103fd565b6000600581111561037057fe5b83600581111561037c57fe5b141561038b57600090506103fd565b600282600581111561039957fe5b8115156103a257fe5b0660028460058111156103b157fe5b8115156103ba57fe5b0614156103e1578160058111156103cd57fe5b8360058111156103d957fe5b1090506103fd565b8160058111156103ed57fe5b8360058111156103f957fe5b1190505b92915050565b6000600581111561041057fe5b600360009054906101000a900460ff16600581111561042b57fe5b14151561043757600080fd5b600554600654014211151561044b57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004549081150290604051600060405180830381858888f19350505050506000600481905550565b60045481565b600360009054906101000a900460ff1681565b60025481565b600060058111156104da57fe5b600360009054906101000a900460ff1660058111156104f557fe5b14151561050157600080fd5b6000600581111561050e57fe5b81600581111561051a57fe5b1415151561052757600080fd5b6004543414151561053757600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561059357600080fd5b80600360006101000a81548160ff021916908360058111156105b157fe5b02179055504260068190555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60065481565b600060058111156105f957fe5b82600581111561060557fe5b1415151561061257600080fd5b6000600581111561061f57fe5b600360009054906101000a900460ff16600581111561063a57fe5b1415151561064757600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156106a257600080fd5b600254600019168282604051808360058111156106bb57fe5b60ff167f01000000000000000000000000000000000000000000000000000000000000000281526001018281526020019250505060405180910390206000191614151561070757600080fd5b61072082600360009054906101000a900460ff1661033a565b15610786576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004546002029081150290604051600060405180830381858888f19350505050506108bb565b61079f600360009054906101000a900460ff168361033a565b1561080657600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004546002029081150290604051600060405180830381858888f19350505050506108ba565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004549081150290604051600060405180830381858888f1935050505050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004549081150290604051600060405180830381858888f19350505050505b5b60006004819055505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060058111156108f957fe5b600360009054906101000a900460ff16600581111561091457fe5b1415151561092157600080fd5b600554600654014211151561093557600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004546002029081150290604051600060405180830381858888f19350505050506000600481905550565b600554815600a165627a7a723058200d4fcf9c61cab51a887e778d01ea1be87a2e90c49913b035314a6e04c3feff570029";
    console.log(ethers.utils.parseEther(amount).toString());
    
    const txParams = {
        from: accounts[0],
        value: ethers.utils.parseEther(amount).toString(),
        chainId: '0x05',
        data: rpsBYTECODE + hash.slice(2) + "000000000000000000000000" + opAddress.slice(2),
    }

    const tx = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
    });
    
    console.log(tx);
    txConfirm(tx).then(r => {
        alert(r);
        var now = new Date().getTime();
        var countdownTime = now + 305000;
        var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countdownTime - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("timer").innerText = minutes + " m : " + seconds + " s ";
        if (distance < 0) {
          clearInterval(x);
          document.getElementById("timer").innerText = "EXPIRED";
        }
    }, 1000);
    document.getElementById('overlay2').style.display = 'none';
    inputs.style.display = 'none';
    waiting.style.display = 'flex';
    });
});

let rpsAddress = undefined;

function txConfirm(txhash) {
    let checkTxLoop = () => {
        return ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txhash]
        }).then(r => {
            if(r != null) {
                rpsAddress = r.contractAddress;
                return rpsAddress;
            } else {
                return checkTxLoop();
            }
        });
    };
    return checkTxLoop();
}  
	

const resetBtn2 = document.getElementById('reset2');

resetBtn2.addEventListener('click', () => {
    selection2.style.display = 'none';
    p2choice = undefined;
    main.style.display = 'flex';
});

const submitBtn2 = document.getElementById('submit2');
const inputs2 = document.getElementById('noInputs');
const waiting2 = document.getElementById('waiting2');

submitBtn2.addEventListener('click', async () => {
    document.getElementById('overlay2').style.display = 'block';
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(accounts[0]);
    const rpsContract = new ethers.Contract(rpsAddress, rpsABI, signer);
    const tx2 = await rpsContract.play(move) //edit move and add value
    console.log(tx2);

    txConfirm(tx2).then(r => {
        var now = new Date().getTime();
        var countdownTime = now + 305000;
        var x = setInterval(function() {
            var now = new Date().getTime();
            var distance = countdownTime - now;
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById("timer2").innerText = minutes + " m : " + seconds + " s ";
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("timer2").innerText = "EXPIRED";
            }
    }, 1000);
    document.getElementById('overlay2').style.display = 'none';
    inputs2.style.display = 'none';
    waiting2.style.display = 'flex';
    })
    
});

let amount = 0.00001;
let opAddress; 

function getInput() {
    ethers.utils.isAddress(opAddress);

}

/*
if (key.length == 0 && amount.length == 0 && opAddress.length == 0) {
    //submit button disabled
    //also check for 0 address
} else {
    //submit button enabled
} */


/* work left 
    reveal design 
    winner design */

const timeBtn = document.getElementById('btn-timeout');
const b2home = document.getElementById('b2home');

timeBtn.addEventListener('click', async () => {
    document.getElementById('overlay2').style.display = 'block';
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(accounts[0]);
    const rpsContract = new ethers.Contract(rpsAddress, rpsABI, signer);
    const timeTx = await rpsContract.j2Timeout();

    txConfirm(timeTx).then(() => {
        b2home.style.display = 'flex';
    })
});

const timeBtn2 = document.getElementById('btn-timeout2');

timeBtn2.addEventListener('click', async () => {
    document.getElementById('overlay2').style.display = 'block';
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(accounts[0]);
    const rpsContract = new ethers.Contract(rpsAddress, rpsABI, signer);
    const timeTx = await rpsContract.j1Timeout();

    txConfirm(timeTx).then(() => {
        b2home.style.display = 'flex';
    })
});

const homeBtn = document.getElementById('home');

homeBtn.addEventListener('click', () => {
    b2home.style.display = 'none';
    p1Choice = undefined;
    p2Choice = undefined;
    create = 0;
    join = 0;
    main.style.display = 'flex';
});

