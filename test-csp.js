/**
 * CSP Validation Test Script
 * Run this to verify that CSP is generated correctly and doesn't contain nonces
 */

import { applySecurityHeaders, validateSvelteKitCSP, cspDirectives } from './src/lib/security.js';
import { generateSecurityHeaders } from './src/lib/httpHeaders.js';

console.log('🔍 Testing CSP Generation...\n');

// Test 1: Primary CSP generation
console.log('1. Testing primary CSP generation (security.ts):');
const primaryHeaders = new Headers();
applySecurityHeaders(primaryHeaders);
const primaryCSP = primaryHeaders.get('content-security-policy');
console.log('Generated CSP:', primaryCSP);

const primaryValidation = validateSvelteKitCSP(primaryHeaders);
console.log('Validation:', primaryValidation);
console.log('');

// Test 2: Additional headers generation (should NOT contain CSP)
console.log('2. Testing additional headers generation (httpHeaders.ts):');
const additionalHeaders = generateSecurityHeaders({
    path: '/test',
    pageType: 'public'
});

const additionalCSP = additionalHeaders.get('content-security-policy');
console.log('Additional headers CSP (should be null):', additionalCSP);

if (additionalCSP) {
    console.error('❌ ERROR: generateSecurityHeaders is setting CSP! This will cause conflicts.');
} else {
    console.log('✅ Good: generateSecurityHeaders does not set CSP');
}
console.log('');

// Test 3: Combined headers (simulating hooks.server.ts)
console.log('3. Testing combined headers (simulating hooks.server.ts):');
const combinedHeaders = new Headers();
applySecurityHeaders(combinedHeaders);

// Simulate the additional headers application (skipping CSP)
additionalHeaders.forEach((value, key) => {
    if (key.toLowerCase() !== 'content-security-policy') {
        combinedHeaders.set(key, value);
    }
});

const finalCSP = combinedHeaders.get('content-security-policy');
console.log('Final CSP:', finalCSP);

const finalValidation = validateSvelteKitCSP(combinedHeaders);
console.log('Final validation:', finalValidation);

// Test 4: Check for SvelteKit compatibility
console.log('\n4. SvelteKit Compatibility Check:');
const hasUnsafeInline = finalCSP?.includes("'unsafe-inline'");
const hasNonces = finalCSP ? /nonce-[A-Za-z0-9+/=]+/.test(finalCSP) : false;

console.log(`Has 'unsafe-inline': ${hasUnsafeInline} ${hasUnsafeInline ? '✅' : '❌'}`);
console.log(`Has nonces: ${hasNonces} ${hasNonces ? '❌ (BAD)' : '✅'}`);

// Test 5: Expected CSP structure
console.log('\n5. Expected CSP Directives:');
Object.entries(cspDirectives).forEach(([key, values]) => {
    if (values && Array.isArray(values)) {
        const expectedDirective = `${key} ${values.join(' ')}`;
        const isPresent = finalCSP?.includes(expectedDirective);
        console.log(`${key}: ${isPresent ? '✅' : '❌'} Expected: "${expectedDirective}"`);
    }
});

console.log('\n🎯 Summary:');
if (finalValidation.isValid && hasUnsafeInline && !hasNonces) {
    console.log('✅ SUCCESS: CSP is correctly configured for SvelteKit!');
    console.log('✅ Production application should now work correctly.');
} else {
    console.log('❌ ISSUES DETECTED:');
    finalValidation.issues.forEach(issue => console.log(`   - ${issue}`));
}
