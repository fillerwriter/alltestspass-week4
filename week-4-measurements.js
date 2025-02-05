/**
 * All Tests Pass: Week 4 - Measurements Part 3
 *
 *
 * Implement a function `convert` that takes two inputs.
 * - `originalMeasurement`: a string with an amount and weight label (50g, 10oz, 4lb, etc)
 * - `conversionTo`: a string with the unit of measure to convert to (g, lb, oz, etc)
 *
 * The return value is a number with the measurement in converted units. (i.e. convert('16oz', 'lb') == 1, for 1 pound).
 *
 * For our current test suite, valid measurement units are 'g', 'kg', 'lb', 'oz', 'c', 'k', and 'f'.
 *
 * Measurement conversions reference: https://www.nist.gov/pml/owm/approximate-conversions-us-customary-measures-metric
 *
 */

import { assert } from "./node_modules/chai/chai.js";

function convert(originalMeasurement, conversionTo) {
    // Strategy: Convert everything to grams, then from grams to anything.
    if (originalMeasurement === undefined) {
        return undefined;
    }

    const measurementUnit = originalMeasurement.match(/[a-zA-Z]+$/gm)[0].toLowerCase();
    const amount = originalMeasurement.match(/[^a-zA-Z]+/gm);

    if (conversionTo === undefined) {
        return amount;
    }

    const weights = ['g', 'oz', 'lb'];
    const temps = ['k', 'f', 'c'];

    if (weights.indexOf(measurementUnit) !== -1 && weights.indexOf(conversionTo) === -1) {
        throw new Error("Improper conversion");
    } else if (temps.indexOf(measurementUnit) !== -1 && temps.indexOf(conversionTo) === -1) {
        throw new Error("Improper conversion");
    }

    const conversionsToG = {
        'g': (x) => x * 1,
        'kg': (x) => x * 0.001,
        'lb': (x) => x * 453.59290944,
        'oz': (x) => x * 28.34949254,
    };

    const conversionsToC = {
        'c': (x) => x * 1,
        'f': (x) => (x - 32) * (5 / 9),
        'k': (x) => x - 273.15,
    }

    const conversionFormulas = (weights.indexOf(measurementUnit) !== -1) ? conversionsToG : conversionsToC;

    const amountInDefaultMeasurement = Math.round(conversionFormulas[measurementUnit](amount) * 1000000) / 1000000;

    const conversionsFromG = {
        'g': (x) => x * 1,
        'kg': (x) => x * 1000,
        'lb': (x) => x * 1 / 453.59290944,
        'oz': (x) => x * 1 / 28.34949254,
    };

    const conversionsFromC = {
        'c': (x) => x * 1,
        'f': (x) => (x * 1.8) + 32,
        'k': (x) => x + 273.15,
    };

    const conversionFormulas2 = (weights.indexOf(conversionTo) !== -1) ? conversionsFromG : conversionsFromC;

    const convertedAmount = Math.round(conversionFormulas2[conversionTo](amountInDefaultMeasurement) * 10000) / 10000;

    return convertedAmount;
}

/**
 * All Tests Pass demo fuzzers.
 */

function atpAmountFuzzer() {
    return (Math.round(Math.random() * 500000) / 1000) + atpUnitFuzzer();
}

function atpUnitFuzzer() {
    const length = (Math.random() > 0.5) ? 1 : 2;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    const validMeasurementUnits = ['g', 'kg', 'oz', 'lb', 'c', 'f', 'k', 'm', 'cm', 'in', 'ft', 'mi', 'km'];

    const charactersLength = characters.length;
    let invalid = false;

    while (invalid === false) {
        let counter = 0;

        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }

        if (validMeasurementUnits.indexOf(result.toLowerCase()) === -1) {
            invalid = true;
        }
    }


    return result;
}

/**
 * Unit tests, don't update anything after this line.
 */

describe("Week 4 - Measurements", function() {
    it ("should return nothing if passed nothing.", function() {
        assert(convert() == undefined, "Nothing passed");
    });

    it ("should return a matching number if no conversion is requested.", function() {
        assert.equal(convert("10g"), 10);
    });

    it ("should convert ounces to grams.", function() {
        assert.equal(convert("10oz", "g"), 283.4949, "10oz == 283.4949g");
    });

    it ("should convert grams to ounces.", function() {
        assert.equal(convert("50g", "oz"), 1.7637, "50g == 1.7637oz");
    });

    it ("should convert pounds to grams.", function() {
        assert.equal(convert("10lb", "g"), 4535.9291, "10lb == 4535.9291g");
    });

    it ("should convert grams to pounds.", function() {
        assert.equal(convert("500g", "lb"), 1.1023, "500g == 1.1023lb");
    });

    it ("should convert ounces to pounds.", function() {
        assert.equal(convert("16oz", "lb"), 1, "");
    });

    it ("should throw an error if converting from a weight to temperature, or temperature to weight", function() {
        // Quirk with assert.throws, need to pass a function so it can wrap it in a try/catch.
        assert.throws(() => {convert("100f", "g")}, Error, "Improper conversion");
    });

    it ("should convert fahrenheit to celcius", function() {
        assert.equal(convert("100f", "c"), 37.7778, "");
        assert.equal(convert("0f", "c"), -17.7778, "");
    });

    it ("should convert celcius to fahrenheit", function() {
        assert.equal(convert("100c", "f"), 212, "");
        assert.equal(convert("32f", "c"), 0, "");
    });

    it ("should convert fahrenheit to kelvin", function() {
        assert.equal(convert("290k", "f"), 62.33, "");
    });

    it ("should convert inches to feet", function() {
        assert.equal(convert("12in", "ft"), 1, "12 inches == 1 foot");
    });

    it ("should convert feet to inches", function() {
        assert.equal(convert("3ft", "in"), 36, "3 feet == 36 inches");
    });

    it ("should convert inches to centimeters", function() {
        assert.equal(convert("6in", "cm"), 15.24, "6 inches == 15.24 cm");
    });

    it ("should convert miles into kilometers", function() {
        assert.equal(convert("100mi", "km"), 160.9344, "100 miles == 160.9344 kilometers");
    });

    it ("for arbitrary input it doesn't understand, it should throw errors", function() {
       for (let i = 0; i < 1000; i++) {
           assert.throws(() => {console.log(convert(atpAmountFuzzer(), atpUnitFuzzer()))});
       }
    });
});