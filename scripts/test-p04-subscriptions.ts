import dotenv from 'dotenv';
import {
  initDb,
  closeDb,
  getPartners,
  savePartner,
  getLeads,
  saveLead,
  confirmPartnerPayment,
  suspendPartner,
  reactivatePartner,
  isSubscriptionActive,
  checkPartnerSubscriptions,
  isPartnerEligibleForLead,
  findBestEligiblePartner,
  assignLeadToPartner,
  sendPartnerLeadEmail,
  getActivityLogs,
  addActivityLog
} from '../src/db/index.js';
import { Partner, Lead } from '../src/types.js';

dotenv.config();

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testName} - ${detail || 'Assertion failed'}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('  LEAD FACTORY AFRICA AI - TEST SUITE P0.4');
  console.log('  PARTNER SUBSCRIPTIONS, ELIGIBILITY & ROTATION');
  console.log('====================================================\n');

  await initDb();

  // ----------------------------------------------------
  // TEST 1: PARTENAIRE VALIDE (Eligible)
  // ----------------------------------------------------
  console.log('TEST 1 — PARTENAIRE VALIDE :');
  const validPartner: Partner = {
    id: 'test-p1-valid',
    name: 'Solaire Test Bobo',
    sector: 'solaire',
    city: 'Bobo-Dioulasso',
    geographicScope: 'Bobo-Dioulasso',
    phone: '+226 70 00 00 01',
    email: 'valid.partner@test.bf',
    status: 'active',
    subscriptionStatus: 'active',
    subscriptionPlan: 'Business',
    subscriptionStartedAt: new Date().toISOString(),
    subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    paymentStatus: 'paid',
    lastPaymentAt: new Date().toISOString(),
    nextPaymentDueAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    leadsReceived: 2,
    maxLeadsPerMonth: 25,
    revenueGenerated: 35000,
    exclusiveAccess: false,
    rotationIndex: 0
  };
  await savePartner(validPartner);
  const check1 = isPartnerEligibleForLead(validPartner, 'solaire', 'Bobo-Dioulasso');
  assert(check1.eligible === true, 'Partner with active subscription & payment is eligible');

  // ----------------------------------------------------
  // TEST 2: PAIEMENT EXPIRÉ (Ineligible)
  // ----------------------------------------------------
  console.log('\nTEST 2 — PAIEMENT EXPIRÉ :');
  const expiredPartner: Partner = {
    ...validPartner,
    id: 'test-p2-expired',
    name: 'Expired Solaire SARL',
    subscriptionExpiresAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), // 5 days ago
  };
  await savePartner(expiredPartner);
  const check2 = isPartnerEligibleForLead(expiredPartner, 'solaire', 'Bobo-Dioulasso');
  assert(check2.eligible === false && check2.reason === 'SUBSCRIPTION_EXPIRED', 'Expired subscription is marked ineligible (SUBSCRIPTION_EXPIRED)');

  // ----------------------------------------------------
  // TEST 3: PAIEMENT OVERDUE (Ineligible)
  // ----------------------------------------------------
  console.log('\nTEST 3 — PAIEMENT OVERDUE :');
  const overduePartner: Partner = {
    ...validPartner,
    id: 'test-p3-overdue',
    name: 'Overdue Partner',
    paymentStatus: 'overdue'
  };
  await savePartner(overduePartner);
  const check3 = isPartnerEligibleForLead(overduePartner, 'solaire', 'Bobo-Dioulasso');
  assert(check3.eligible === false && check3.reason === 'PAYMENT_OVERDUE', 'Partner with payment overdue is ineligible (PAYMENT_OVERDUE)');

  // ----------------------------------------------------
  // TEST 4: PARTENAIRE SUSPENDU (Ineligible)
  // ----------------------------------------------------
  console.log('\nTEST 4 — PARTENAIRE SUSPENDU :');
  const suspendedPartner: Partner = {
    ...validPartner,
    id: 'test-p4-suspended',
    name: 'Suspended Partner',
    status: 'suspended'
  };
  await savePartner(suspendedPartner);
  const check4 = isPartnerEligibleForLead(suspendedPartner, 'solaire', 'Bobo-Dioulasso');
  assert(check4.eligible === false && check4.reason === 'PARTNER_SUSPENDED', 'Suspended partner is ineligible (PARTNER_SUSPENDED)');

  // ----------------------------------------------------
  // TEST 5: SÉPARATION DES SECTEURS
  // ----------------------------------------------------
  console.log('\nTEST 5 — SÉPARATION DES SECTEURS :');
  const check5 = isPartnerEligibleForLead(validPartner, 'immobilier', 'Bobo-Dioulasso');
  assert(check5.eligible === false && check5.reason === 'SECTOR_MISMATCH', 'Sector mismatch rejected (SECTOR_MISMATCH)');

  // ----------------------------------------------------
  // TEST 6: SÉPARATION GÉOGRAPHIQUE
  // ----------------------------------------------------
  console.log('\nTEST 6 — SÉPARATION GÉOGRAPHIQUE :');
  const check6 = isPartnerEligibleForLead(validPartner, 'solaire', 'Koudougou');
  assert(check6.eligible === false && check6.reason === 'ZONE_MISMATCH', 'Geographic zone mismatch rejected (ZONE_MISMATCH)');

  // ----------------------------------------------------
  // TEST 7: ROTATION ÉQUITABLE (Fair Rotation)
  // ----------------------------------------------------
  console.log('\nTEST 7 — ROTATION ÉQUITABLE :');
  const partnerA: Partner = {
    ...validPartner,
    id: 'test-rot-a',
    name: 'Partner Rot A',
    leadsReceived: 5,
    rotationIndex: 5,
    lastAssignedAt: new Date(Date.now() - 3600000).toISOString()
  };
  const partnerB: Partner = {
    ...validPartner,
    id: 'test-rot-b',
    name: 'Partner Rot B',
    leadsReceived: 1,
    rotationIndex: 1,
    lastAssignedAt: new Date(Date.now() - 7200000).toISOString()
  };
  await savePartner(partnerA);
  await savePartner(partnerB);

  const bestForSolaire = await findBestEligiblePartner('solaire', 'Bobo-Dioulasso');
  assert(bestForSolaire?.id === 'test-rot-b', 'Fair rotation selects partner with lowest leadsReceived (Partner B)');

  // ----------------------------------------------------
  // TEST 8: LEAD SANS PARTENAIRE ÉLIGIBLE
  // ----------------------------------------------------
  console.log('\nTEST 8 — LEAD SANS PARTENAIRE DISPONIBLE :');
  const bestForForage = await findBestEligiblePartner('forage_introuvable_xyz', 'Dédougou');
  assert(bestForForage === null, 'No eligible partner returns null without crash');

  // Verify lead persistence in WAITING_FOR_PARTNER status
  const orphanLead: Lead = {
    id: 'test-orphan-lead-1',
    siteId: 'site-1',
    siteTitle: 'Faso Solaire Solutions',
    name: 'Moussa Orphan',
    phone: '+226 70 99 99 99',
    email: 'orphan@test.bf',
    city: 'Dédougou',
    rawMessage: 'Besoin de forage agricole',
    status: 'WAITING_FOR_PARTNER' as any,
    score: 85,
    summarizedNeed: 'Forage agricole',
    budget: 'Moyen',
    urgency: 'Moyen',
    keyPainPoint: 'Pas d eau',
    suggestedAction: 'Trouver un foreur',
    responseDraft: 'En attente d attribution',
    assignedPartnerId: null,
    createdAt: new Date().toISOString(),
    consentCILChecked: true,
    consentPartnerChecked: true,
    ipAddress: '196.28.24.1',
    isFlaggedAnomaly: false,
    securityRiskLevel: 'none',
    securityLogs: [],
    distributionChannels: {
      email: { sent: false, sentAt: null, recipient: '' },
      whatsapp: { sent: false, sentAt: null, formattedMessage: '' },
      telegram: { sent: false, sentAt: null, botCommandTriggered: '' }
    },
    distributionType: 'standard'
  };
  await saveLead(orphanLead);
  const leads = await getLeads();
  const savedOrphan = leads.find(l => l.id === orphanLead.id);
  assert(savedOrphan !== undefined && savedOrphan.status === ('WAITING_FOR_PARTNER' as any), 'Orphan lead is preserved safely in WAITING_FOR_PARTNER state');

  // ----------------------------------------------------
  // TEST 9: PAIEMENT ET RÉACTIVATION
  // ----------------------------------------------------
  console.log('\nTEST 9 — PAIEMENT & RÉACTIVATION :');
  const partnerToSuspend: Partner = {
    ...validPartner,
    id: 'test-p9-reactivate',
    name: 'Suspended to Reactivate'
  };
  await savePartner(partnerToSuspend);
  await suspendPartner(partnerToSuspend.id, 'PAYMENT_OVERDUE');
  
  let pStatus = await isSubscriptionActive(partnerToSuspend.id);
  assert(pStatus.active === false, 'Partner is suspended');

  // Confirm payment
  const paymentRes = await confirmPartnerPayment(partnerToSuspend.id, 'ORANGE-MONEY-REF-5544', 50000, 30);
  assert(paymentRes.success === true, 'Payment confirmation succeeded');
  assert(paymentRes.partner?.status === 'active' && paymentRes.partner?.paymentStatus === 'paid', 'Partner reactivated with paymentStatus paid');
  
  const checkReactivated = isPartnerEligibleForLead(paymentRes.partner!, 'solaire', 'Bobo-Dioulasso');
  assert(checkReactivated.eligible === true, 'Reactivated partner is immediately eligible again');

  // ----------------------------------------------------
  // TEST 10: LOGS D'AUDIT COMMERCIAUX
  // ----------------------------------------------------
  console.log('\nTEST 10 — LOGS D AUDIT COMMERCIAUX :');
  const activityLogs = await getActivityLogs();
  const paymentLogs = activityLogs.filter(l => l.type === ('PARTNER_PAYMENT_CONFIRMED' as any) || l.message.includes('PAIEMENT CONFIRMÉ'));
  assert(paymentLogs.length > 0, 'Commercial audit log recorded for payment confirmation');

  // ----------------------------------------------------
  // TEST 11: ENVOI EMAIL DE NOTIFICATION LEAD
  // ----------------------------------------------------
  console.log('\nTEST 11 — ENVOI EMAIL DE NOTIFICATION :');
  const testLeadForEmail: Lead = {
    ...orphanLead,
    id: 'test-email-lead-1',
    city: 'Bobo-Dioulasso'
  };
  const emailRes = await sendPartnerLeadEmail(validPartner, testLeadForEmail);
  assert(emailRes.success === true && emailRes.sentAt !== null, 'Lead notification email dispatched successfully to partner');

  // ----------------------------------------------------
  // TEST 12: GESTION DES ERREURS EMAIL (RÉSILIENCE)
  // ----------------------------------------------------
  console.log('\nTEST 12 — GESTION DES ERREURS EMAIL :');
  const invalidEmailPartner: Partner = {
    ...validPartner,
    id: 'test-invalid-email-p',
    email: 'bad-email-no-at-sign'
  };
  const failedEmailRes = await sendPartnerLeadEmail(invalidEmailPartner, testLeadForEmail);
  assert(failedEmailRes.success === false, 'Invalid email fails gracefully');
  
  const updatedLogs = await getActivityLogs();
  const emailFailedLog = updatedLogs.find(l => l.type === ('PARTNER_EMAIL_FAILED' as any) || l.message.includes('PARTNER_EMAIL_FAILED'));
  assert(emailFailedLog !== undefined, 'Email failure logged in audit trail without crashing or losing lead');

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`  P0.4 RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('====================================================\n');

  await closeDb();

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error running P0.4 tests:', err);
  process.exit(1);
});
