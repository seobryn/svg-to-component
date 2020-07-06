# How to use:

1. run  ```yarn install```

2. create __icons__ folder in the project root

3. Inside __icons__ folder put your SVG images that you want to transform.

4. run  ```yarn transform:[framework]``` to generate components folder with all vue components, other Frameworks Coming soon!.

5. when complete you can find out your SVG Components inside __components/vue__ ready to use!.

## Frameworks Available:

- [X] vue
- [X] react (in test)

Do you Want to donate? 

<div id="paypal-button-container"></div>
<script src="https://www.paypal.com/sdk/js?client-id=sb&currency=USD" data-sdk-integration-source="button-factory"></script>
<script>
  paypal.Buttons({
      style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'paypal',
          
      },
      createOrder: function(data, actions) {
          return actions.order.create({
              purchase_units: [{
                  amount: {
                      value: '5'
                  }
              }]
          });
      },
      onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
              alert('Transaction completed by ' + details.payer.name.given_name + '!');
          });
      }
  }).render('#paypal-button-container');
</script>