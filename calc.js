$( document ).ready(function() {
    validateform();
    $('.ui form').submit(function(event) {
        event.preventDefault();
        if ($('.ui.form').form('is valid')) {
            calculateConsumtion();
        }
    });
});

function validateform() {
    $('.ui.form')
    .form({
        fields: {
          field1: {
            identifier: 'daily-usage-hours',
            rules: [
              {
                type   : 'empty',
                prompt : '{name} cannot be empty'
              },
              {
                type   : 'integer[1..24]',
                prompt : 'Invalid value for number of hours'
              }
            ]
          },
          field2: {
            identifier: 'yearly-usage-days',
            rules: [
              {
                type   : 'empty',
                prompt : '{name} cannot be empty'
              },
              {
                type   : 'integer[1..365]',
                prompt : 'Invalid value for number of days'
              }
            ]
          },
          field3: {
            identifier: 'per-unit-cost',
            rules: [
              {
                type   : 'empty',
                prompt : '{name} cannot be empty'
              }
            ]
          },
          field4: {
            identifier: 'inverter-efficiency',
            rules: [
              {
                type   : 'empty',
                prompt : '{name} cannot be empty'
              }
            ]
          },          
          field5: {
            identifier: 'power-inverter',
            rules: [
              {
                type   : 'empty',
                prompt : '{name} cannot be empty'
              }
            ]
          },
          field6: {
            identifier: 'power-non-inverter',
            rules: [
              {
                type   : 'empty',
                prompt : '{name} cannot be empty'
              }
            ]
          },
          field7: {
            identifier: 'cost-inverter',
            rules: [
              {
                type   : 'empty',
                prompt : '{name} cannot be empty'
              }
            ]
          },
          field8: {
            identifier: 'cost-non-inverter',
            rules: [
              {
                type   : 'empty',
                prompt : '{name} cannot be empty'
              }
            ]
          },
        }
      }
    );
}

function calculateConsumtion() {
    var $form = $('.ui form');
    var dailyUsageHours = $form.form('get value', 'daily-usage-hours');
    var yearlyUsageDays = $form.form('get value', 'yearly-usage-days');
    var perUnitCost = $form.form('get value', 'per-unit-cost');
    var inverterEfficiency = $form.form('get value', 'inverter-efficiency');
    var powerInverter = $form.form('get value', 'power-inverter');
    var powerNonInverter = $form.form('get value', 'power-non-inverter');
    var costInverter = $form.form('get value', 'cost-inverter');
    var costNonInverter = $form.form('get value', 'cost-non-inverter');

    // calculate usage units for each AC, per year
    var invUnitUsageDaily = (powerInverter/1000) * dailyUsageHours * ((100 - inverterEfficiency)/100);
    // fix to two decimal points
    invUnitUsageDaily = invUnitUsageDaily.toFixed(2)
    var invUnitUsageYear = invUnitUsageDaily * yearlyUsageDays;

    var stdUnitUsageDaily = (powerNonInverter/1000) * dailyUsageHours;
    var stdUnitUsageYear =  stdUnitUsageDaily * yearlyUsageDays;

    // calculate cost
    var invYearlyCost = (invUnitUsageYear * perUnitCost).toFixed(2);
    var stdYearlyCost = stdUnitUsageYear * perUnitCost;

    // savings
    var savings = (stdYearlyCost - invYearlyCost).toFixed(2);

    // years it will take to recover the extra amount spent on inverter
    var yearsToRecover = ((costInverter - costNonInverter) / savings).toFixed(2);

    // set the result table
    $("#daily-consum-inv").text(invUnitUsageDaily);
    $("#daily-consum-std").text(stdUnitUsageDaily);
    $("#yearly-consum-inv").text(invUnitUsageYear);
    $("#yearly-consum-std").text(stdUnitUsageYear);
    $("#yearly-cost-inv").text(invYearlyCost);
    $("#yearly-cost-std").text(stdYearlyCost);
    $("#yearly-savings").text(savings);

    $('#yearly-savings-span').text(savings);
    $('#years-to-recover').text(yearsToRecover);

    $('.hidden').removeClass('hidden');
}