// Function that returns a weight based 
export function getTempAndVisWeight(time, weatherCode) {
  const hours = time.getHours();
  const cloudy = weatherCode < 2;

  if (hours < 10) {
    return cloudy ? {
      temp: 0.8,
      visibility: 0.7
    } : {
      temp: 0.5,
      visibility: 0.9
    };
  } else if (hours < 12) {
    return cloudy ? {
      temp: 0.9,
      visibility: 0.8
    } : {
      temp: 0.75,
      visibility: 1
    };
  } else if (hours < 14) {
    return cloudy ? {
      temp: 1,
      visibility: 0.9
    } : {
      temp: 1,
      visibility: 1
    };
  } else if (hours < 16) {
    return cloudy ? {
      temp: 0.8,
      visibility: 0.8
    } : {
      temp: 0.9,
      visibility: 0.9
    };
  } else {
    return cloudy ? {
      temp: 0.7,
      visibility: 0.7
    } : {
      temp: 0.7,
      visibility: 0.8
    };
  }
}

