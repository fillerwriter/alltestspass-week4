/**
 * All Tests Pass: Week 3 - Measurements Part 2
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

    const conversionsToG = {
        'g': 1,
        'kg': 0.001,
        'lb': 453.59290944,
        'oz': 28.34949254,
    };

    const amountInGrams = Math.round(amount * conversionsToG[measurementUnit] * 1000000) / 1000000;

    const conversionsFromG = {
        'g': 1,
        'kg': 1000,
        'lb': 1 / 453.59290944,
        'oz': 1 / 28.34949254,
    };

    const convertedAmount = Math.round(amountInGrams * conversionsFromG[conversionTo] * 10000) / 10000;

    return convertedAmount;
}

describe("Week 3 - Measurements", function() {
    it ("should return nothing if passed nothing.", function() {
        chai.assert(convert() == undefined, "Nothing passed");
    });

    it ("should return a matching number if no conversion is requested.", function() {
        chai.assert.equal(convert("10g"), 10);
    });

    it ("should convert ounces to grams.", function() {
        chai.assert.equal(convert("10oz", "g"), 283.4949, "10oz == 283.4949g");
    });

    it ("should convert grams to ounces.", function() {
        chai.assert.equal(convert("50g", "oz"), 1.7637, "50g == 1.7637oz");
    });

    it ("should convert pounds to grams.", function() {
        chai.assert.equal(convert("10lb", "g"), 4535.9291, "10lb == 4535.9291g");
    });

    it ("should convert grams to pounds.", function() {
        chai.assert.equal(convert("500g", "lb"), 1.1023, "500g == 1.1023lb");
    });

    it ("should convert ounces to pounds.", function() {
        chai.assert.equal(convert("16oz", "lb"), 1, "");
    });

    it ("should throw an error if converting from a weight to temperature, or temperature to weight", function() {
        // Quirk with assert.throws, need to pass a function so it can wrap it in a try/catch.
        chai.assert.throws(() => {convert("100f", "g")}, Error, "Improper conversion");
    });

    it ("should convert fahrenheit to celcius", function() {
        chai.assert.equal(convert("100f", "c"), 37.7778, "");
        chai.assert.equal(convert("0f", "c"), -17.7778, "");
    });

    it ("should convert celcius to fahrenheit", function() {
        chai.assert.equal(convert("100c", "f"), 212, "");
        chai.assert.equal(convert("32f", "c"), 0, "");
    });

    it ("should convert fahrenheit to kelvin", function() {
        chai.assert.equal(convert("290k", "f"), 62.33, "");
    });
});