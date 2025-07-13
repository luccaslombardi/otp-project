import { totp, hotp } from 'otplib';

totp.options = {
  digits: 6,
  step: 120,
};

hotp.options = {
  digits: 6,
};
