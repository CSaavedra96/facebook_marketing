import data from '../config/data.json';

export const AD_ACCOUNTS_PARAMS = {
    fields: 'name,account_id',
};

export const CUSTOM_AUDIENCE_PARAMS = {
    name: '',
    subtype: 'CUSTOM',
    description: '',
    customer_file_source: 'USER_PROVIDED_ONLY',
};

export const SUBMIT_CUSTOM_AUDIENCE_PARAMS = {
    payload: data,
};

export const FB_SCOPE_LOGIN = {
    scope: 'ads_management, ads_read'
};