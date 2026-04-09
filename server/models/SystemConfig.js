const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
    aiQuizGenEnabled: { type: Boolean, default: true },
    aiRecommendationEnabled: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    registrationEnabled: { type: Boolean, default: true },
    systemAlertMessage: { type: String, default: '' },
    lastBackup: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
