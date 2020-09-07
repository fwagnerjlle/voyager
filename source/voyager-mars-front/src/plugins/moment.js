import moment from 'moment';

moment.locale('en');
// eslint-disable-next-line
export const dateFormat = (val, format) => moment(val).format((format || 'DD/MM/YYYY'));
