const mongoose = require('mongoose');
const userThemeSchema = new mongoose.Schema({
    userId: String,
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

const UserTheme = mongoose.model('UserTheme', userThemeSchema);
module.exports = UserTheme;