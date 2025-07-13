import { totp, hotp } from 'otplib';

totp.options = {
  digits: 6,
  step: 60,
};

hotp.options = {
  digits: 6,
  step: 60,
};
