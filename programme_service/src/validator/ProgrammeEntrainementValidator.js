const { Validator } = require('jsonschema');

module.exports = {
  verifyProgrammeEntrainement: (req) => {
    const validator = new Validator();

    const programmeSchema = {
      type: 'object',
      properties: {
        name: { 
            type: 'string', 
            minLength: 1 
        },
        description: { 
            type: 'string', 
            minLength: 1 
        },
        exercises: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              name: { 
                type: 'string',
                minLength: 1 
            },
              repetitions: { 
                type: 'number', 
                minimum: 1 
            },
              sets: { 
                type: 'number', 
                minimum: 1 
            },
            completed: { 
                type: 'boolean' 
            },
            },
            required: ['name', 'repetitions', 'sets'],
          },
        },
        createdBy: { 
            type: 'string', 
            minLength: 1 
        },
      },
      required: ['name', 'description', 'exercises'],
    };

    const validationResponse = validator.validate(req.body, programmeSchema);

    if (validationResponse.errors.length > 0) {
      return validationResponse.errors.map((error) => error.message || error.stack);
    }
  },
};
