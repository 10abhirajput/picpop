/*
|-------------------------------------------------------------------------------------------------------
| Constants File
|-------------------------------------------------------------------------------------------------------
| In this file all the constants set to globals for using them through out the project.
|
*/

global.appPort = 7807;

global.securityKey = '__picpop';

global.appName = 'Picspop';

global.appShortName = 'P';

global.appFavUrl = '/assets/img/logo/logo.png';

global.appLogoUrl = '/assets/img/logo/logo.png';

global.appVersion = '0.0.1';

global.companyName = 'CqlSys';

global.companyUrl = 'https://www.cqlsys.com/';

global.copyrightYear = '2021';

global.jwtSecretKey = 'asafdadfa1231asdfaakf123124o1i24bcd';

global.model = '';

global.modelTitle = '';

global.currentModule = '';

global.currentSubModule = '';

global.currentSubModuleSidebar = '';
 
global.twilioSID = 'AC38fb4657501006f896c1e3c9e211ae0b';

global.twilioToken = '87bf20a30c3032c8fce649aad112d25f';

global.twilioNumber = +15712063913

global.moduleRoles = {
  0: 'admin',
  3: 'sellerAdmin',
  4: 'reviewAdmin',
}


global.roleTypes = {
  0: 'Admin',
  1: 'User',
  2: 'Location Owner Detail',
  3: 'Business Professional Detail',
  4: 'Review Admin',
}

global.userRoleModels = {
  0: 'adminDetail',
  1: 'userDetail',
  2: 'locationOwnerDetail',
  3: 'businessProfessionalDetail',
  4: 'adminDetail',
}

global.modelImageFolder = {
  0: 'user',
  1: 'user',
  2: 'user',
  3: 'user',
}

/*
|-------------------------------------------------------------------------------------------------------
| Global Functions
|-------------------------------------------------------------------------------------------------------
| 
|
*/
global.log = function () {
  const key = Object.keys(this)[0];
  const value = this[key];
  console.log(value, `:=======================================================>${key}`);
}
/*
|-------------------------------------------------------------------------------------------------------
| Mail Auth Configuration
|-------------------------------------------------------------------------------------------------------
| In this section mail auth configuration object is set.
|
*/

// need to create the following email id on gmail first
global.mailAuth = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  service: 'gmail',
  auth: {
    user: 'mypicspop@gmail.com',
    pass: 'Dream1022!'
  }
};


/*
|-------------------------------------------------------------------------------------------------------
| Color Classes
|-------------------------------------------------------------------------------------------------------
| In this section color classes suffixes for bg-color & text-color, for example bg-orange & text-orange.
|
*/

global.colorClasses = [
  'orange',
  'yellow',
  'indigo',
  'blue',
  'green',
  'red',
  'purple',
  'cyan',
  'gray',
  'teal',
  'pink',
  'gray-dark',
];

/*
|-------------------------------------------------------------------------------------------------------
| NPM modules set to globals
|-------------------------------------------------------------------------------------------------------
| In this section NPM modules set to globals
|
*/

global.moment = require('moment');

module.exports = global;

