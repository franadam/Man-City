import validator from 'validator';

export const firebaseLooper = snapshot => {
  const data = [];
  snapshot.forEach(element => {
    data.push({
      ...element.val(),
      id: element.key
    })
  });
  return data;
}

export const reverseArray = (actualArray) => {
  const reversedArray = [];
  let i;
  for(i = actualArray.length-1; i >= 0; i--){
      reversedArray.push(actualArray[i]);
  }
  return reversedArray;
}

export const validate = element => {
  let error = [true, ''];

  if (element.validation.email) {
    const valid = validator.isEmail(element.value);
    const message = `${!valid ? 'Please enter a valid email': ''}`;
    error = !valid ? [valid, message] : error;
  }

  if (element.validation.required) {
    const valid = element.value.trim() !== '';
    const message = `${!valid ? 'This field is required': ''}`;
    error = !valid ? [valid, message] : error;
  }

  return error;
}

export const updateObject = (oldObj, updatedProperties) => {
  return {
      ...oldObj,
      ...updatedProperties
  }
};
