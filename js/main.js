document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // FAQ accordion (each faq-list/faq-modal-list container manages its own open item)
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;
      var container = btn.closest('.faq-list, .faq-modal-list') || document;

      container.querySelectorAll('.faq-question').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      answer.style.maxHeight = expanded ? null : answer.scrollHeight + 'px';
    });
  });

  // FAQ "View More" modal
  var faqModalOverlay = document.getElementById('faqModalOverlay');
  var faqViewMoreBtn = document.getElementById('faqViewMoreBtn');
  var faqModalClose = document.getElementById('faqModalClose');

  function openFaqModal() {
    faqModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeFaqModal() {
    faqModalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (faqModalOverlay && faqViewMoreBtn && faqModalClose) {
    faqViewMoreBtn.addEventListener('click', openFaqModal);
    faqModalClose.addEventListener('click', closeFaqModal);
    faqModalOverlay.addEventListener('click', function (e) {
      if (e.target === faqModalOverlay) closeFaqModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && faqModalOverlay.classList.contains('open')) closeFaqModal();
    });
  }

  // Enroll form (seat count only; Stripe checkout wires in later)
  var enrollForm = document.getElementById('enrollForm');
  var formSuccess = document.getElementById('formSuccess');
  var seatsInput = document.getElementById('seats');
  var formTotal = document.getElementById('formTotal');
  var priceOriginal = document.getElementById('priceOriginal');
  var priceAmount = document.getElementById('priceAmount');

  // Bulk seat pricing applies automatically, individual or business
  var bulkTiers = [
    { min: 101, price: 218.49 },
    { min: 51, price: 220.79 },
    { min: 21, price: 223.09 },
    { min: 11, price: 225.39 },
    { min: 2, price: 227.69 }
  ];

  if (enrollForm && seatsInput && formTotal) {
    var basePrice = parseFloat(enrollForm.dataset.pricePerSeat);
    var pricePerSeatFor = function (seats) {
      for (var i = 0; i < bulkTiers.length; i++) {
        if (seats >= bulkTiers[i].min) return bulkTiers[i].price;
      }
      return basePrice;
    };
    var updatePricing = function () {
      var seats = Math.max(1, parseInt(seatsInput.value, 10) || 1);
      var pricePerSeat = pricePerSeatFor(seats);
      var discounted = pricePerSeat < basePrice;

      if (priceOriginal && priceAmount) {
        priceOriginal.hidden = !discounted;
        priceOriginal.textContent = '$' + basePrice.toFixed(2);
        priceAmount.textContent = '$' + pricePerSeat.toFixed(2);
      }
      formTotal.textContent = 'Total: $' + (seats * pricePerSeat).toFixed(2);
    };
    seatsInput.addEventListener('input', updatePricing);
    updatePricing();
  }

  if (enrollForm && formSuccess) {
    enrollForm.addEventListener('submit', function (e) {
      e.preventDefault();
      enrollForm.hidden = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

});
