import { totp, hotp } from 'otplib';

totp.options = {
  digits: 6,
  step: 300,
  window: 1
};

hotp.options = {
  digits: 6,
};
