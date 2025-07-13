import { authenticator, totp, hotp } from 'otplib';

authenticator.options = {
  digits: 6,
  step: 30, 
};

totp.options = {
  digits: 6,
  step: 30,
};

hotp.options = {
  digits: 6,
  counter: 0,
};
