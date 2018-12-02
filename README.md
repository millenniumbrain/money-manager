# Money Manager


Simple budgeting application that helps with manaing income, expenses, bills, invoices, and eventually budgeting. Currently working to add Excel exporting and invoice generation using Stripe APIs. Adding a calendar would be the next step.

## Requirements
- Ruby <2.0.0
- TypeScript
- Yarn
- Sass
- SQLite 3

In order to use the app follow these steps:

1. Create a .env.rb file: with these variables
```ruby
ENV['SECRET'] = "randomly generated secret goes here"
ENV['HMAC_SECRET'] = "randomly generate secret goes here" # required for rbnacl
ENV['OPS_LIMIT'] = (2**20).to_s # required for rbnacl
ENV['MEM_LIMIT'] = (2**24).to_s # required for rbnacl
ENV['DIGEST_SIZE'] = 64.to_s # required for rbnacl
ENV['BASE_URL'] = "localhost or domain goes here"
```
2. Then setup a basic application for the backend
```bash
bundle --path vendor
bundle --binstubs
bin/rake sqlite:migrate
bin/rake sqlite:setup
```

3. Generate the frontend
```bash
yarn run build
```

4. Launch the server
```
bin/puma
```