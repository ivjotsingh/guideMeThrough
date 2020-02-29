const Joi = require('joi')

function validateMilestone (data){
    const schema = {
        'title': Joi.string().min(3).required()
    }
    return Joi.validate(data, schema)

}

module.exports.MilestoneValidator = validateMilestone;


