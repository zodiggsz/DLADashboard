## dla-dashboard

This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
gulp serve
```
running gulp serve runs local deployment

With the local dev running go to:
https://codicast1.sharepoint.com

Login with codicast creds to view running code

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

Change file src/config.ts by uncommenting   spURi: 'https://dlamil.dps.mil/sites/SPO_PEODashboard',

gulp clean 
gulp test 
gulp serve 
gulp bundle --ship 
gulp package-solution --ship

NVM: 
1. curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
2. export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
3. nvm use 10.24.0
