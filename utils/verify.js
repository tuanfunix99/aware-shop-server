exports.verify = () => {
    const arr = [
      "q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b",
      "n",
      "m",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
    ];
  
    let token = '';
    for(let i = 0; i < 20; i++){
        token += arr[Math.floor(Math.random(0) * arr.length)];
    }
  
    return token;
  };
  