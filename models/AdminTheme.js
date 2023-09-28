const mongoose = require('mongoose');
const adminThemeSchema = new mongoose.Schema({
    adminId: String,
    // Sidebar
    sideBarBackground: String,
    sideBarIconTextColor: String,
    sideBarHoverTextIconColor: String,
    sideBarHoverBackgroundColor: String,
    // Header
    headerBackgroundColor: String,
    headerTextColor: String,
    // Buttons
    defaultButtonBackgroundColor: String,
    addNewBackgroundColor: String,
    exportsBackgroundColor: String,
    defaultButtonsTextColor: String,
    addNewTextColor: String,
    exportsTextColor: String,
    defaultButtonHoverBackgroundColor: String,
    addNewHoverBackgroundColor: String,
    exportHoverBackgroundColor: String,
    defaultButtonHoverTextColor: String,
    addNewHoverTextColor: String,
    exportHoverTextColor: String,
});

const AdminTheme = mongoose.model('AdminTheme', adminThemeSchema);
module.exports = AdminTheme;