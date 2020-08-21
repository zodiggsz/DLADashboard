'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class '-webkit-box-flex' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class '-ms-flex' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'carousel__dot-group' is not camelCase and will not be type-safe.`);

build.initialize(require('gulp'));
