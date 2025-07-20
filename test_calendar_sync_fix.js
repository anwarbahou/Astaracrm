// Test script to verify calendar sync status persistence
// Run this in the browser console on the calendar page

console.log('Testing calendar sync status persistence...');

// Test 1: Check if access token is persisted
function testTokenPersistence() {
  console.log('=== Test 1: Token Persistence ===');
  
  // Check if token exists in localStorage
  const token = localStorage.getItem('google_calendar_access_token');
  console.log('Token in localStorage:', !!token);
  
  // Check if service has token
  const service = window.googleCalendarService || window.googleCalendarService?.getInstance?.();
  if (service) {
    console.log('Service has token:', service.isAuthenticated());
  } else {
    console.log('Service not available');
  }
}

// Test 2: Simulate page refresh
function testPageRefresh() {
  console.log('=== Test 2: Page Refresh Simulation ===');
  
  // Store current state
  const currentToken = localStorage.getItem('google_calendar_access_token');
  console.log('Before refresh simulation - Token:', !!currentToken);
  
  // Simulate service reinitialization
  if (window.googleCalendarService) {
    const newService = new window.googleCalendarService.constructor();
    console.log('After service reinit - Has token:', newService.isAuthenticated());
  }
}

// Test 3: Check UI state
function testUIState() {
  console.log('=== Test 3: UI State ===');
  
  // Look for sync buttons
  const syncButton = document.querySelector('button[onclick*="sync"], button:contains("Sync")');
  const disconnectButton = document.querySelector('button:contains("Disconnect")');
  
  console.log('Sync button visible:', !!syncButton);
  console.log('Disconnect button visible:', !!disconnectButton);
  
  // Check for connection status indicators
  const connectedState = document.querySelector('[data-connected="true"]');
  console.log('Connected state indicator:', !!connectedState);
}

// Run all tests
function runAllTests() {
  console.log('🧪 Running Calendar Sync Fix Tests...');
  testTokenPersistence();
  testPageRefresh();
  testUIState();
  console.log('✅ Tests completed');
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  runAllTests();
}

module.exports = { runAllTests, testTokenPersistence, testPageRefresh, testUIState }; 