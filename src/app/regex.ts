//password ->password
// email ->email
// zipcode ->zipcode
// phoneno ->Phone
// firstName , lastName -> name tag
// CITY STATE COUNTRY  -> address tag
//ssn ->ssn tag
// URL ->url tag
//share ->share tag
// bank_aacount_Number -> Bank account Number
//routing number-> routing number tag
//trust name -> trust tag
// currency -> currency tag
//number -> number
// existingPolicy -> Policy Tag
// DOB ->dob tag

export const regexMap: Map<string, RegExp> = new Map();
regexMap.set('name', /^([a-zA-Z \-\'])+[a-zA-Z]?$/);
regexMap.set('email', /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
regexMap.set('address', /^[ A-Za-z0-9_@./#&+-]*$/);
regexMap.set('zipcode', /(^\d{5}$)|(^\d{5}-\d{4}$)/);
regexMap.set('ssn', /^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$/);
regexMap.set('dob', /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/);
regexMap.set(
  'Phone',
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/
);

regexMap.set('number', /^[0-9]*$/);
regexMap.set(
  'password',
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
);
regexMap.set(
  'url',
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
);
regexMap.set('share', /^(0?[1-9]|[1-9][0-9]|100)$/);
regexMap.set('bank_account_number', /^[0-9]{2,20}$/);
regexMap.set('routing_number', /^([0-9]{9})$/);
regexMap.set('trust', /^([a-zA-Z \-\'\d])+[a-zA-Z]?$/);
regexMap.set('currency', /^[1-9]\d*(\.\d+)?$/);
regexMap.set('existingPolicy', /^([a-zA-Z0-9_-]){3,25}$/);
