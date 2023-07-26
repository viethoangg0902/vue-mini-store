export const convertVN = (str, withoutSpecChar = false, ignoreTrim = false) => {
  str = (str || '').toString().toLowerCase();
  if (!ignoreTrim) str = str.trim();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  if (withoutSpecChar) {
    return str;
  } else {
    return str.replace(/[^a-zA-Z0-9/, ]/g, '');
  }
};

export const formatMoney = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export const formatMoneyChange = (value) => {
  if (value === "") return;
  // value = value.length != 0 ? value.join(",") : value.toString(); 
  value = value.toString().includes('0') ? value.toString().replace(/^0+/, '') : value.toString();
  value = value.toString().includes(',') ? value.toString().replace(/,/g, "") : value.toString();
  if (value.length > 3) {
    const noCommas = Math.ceil(value.length / 3) - 1;
    const remain = value.length - (noCommas * 3);
    const newVal = [];
    for (let i = 0; i < noCommas; i++) {
      newVal.unshift(value.substr(value.length - (i * 3) - 3, 3));
    }
    newVal.unshift(value.substr(0, remain));
    return newVal;
  } else {
    return value;
  }
};
