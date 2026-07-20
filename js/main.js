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

  // FAQ accordion (each faq-list/faq-page-list container manages its own open item)
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;
      var container = btn.closest('.faq-list, .faq-page-list') || document;

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

  // State-by-state mold law search (FAQ page)
  var stateSearchInput = document.getElementById('stateSearchInput');
  var stateLawGrid = document.getElementById('stateLawGrid');
  var stateSearchEmpty = document.getElementById('stateSearchEmpty');

  if (stateSearchInput && stateLawGrid) {
    var stateCards = Array.prototype.slice.call(stateLawGrid.querySelectorAll('.state-law-card'));
    stateSearchInput.addEventListener('input', function () {
      var query = stateSearchInput.value.trim().toLowerCase();
      var visibleCount = 0;
      stateCards.forEach(function (card) {
        var matches = card.textContent.toLowerCase().indexOf(query) !== -1;
        card.hidden = !matches;
        if (matches) visibleCount++;
      });
      if (stateSearchEmpty) stateSearchEmpty.hidden = visibleCount !== 0;
    });
  }

  // Enroll form (seat count only; Stripe checkout wires in later)
  var enrollForm = document.getElementById('enrollForm');
  var formSuccess = document.getElementById('formSuccess');
  var seatsInput = document.getElementById('seats');
  var formTotal = document.getElementById('formTotal');
  var priceOriginal = document.getElementById('priceOriginal');
  var priceAmount = document.getElementById('priceAmount');
  var courseSelect = document.getElementById('courseSelect');
  var courseName = document.getElementById('courseName');
  var courseHours = document.getElementById('courseHours');
  var bulkPricingToggle = document.getElementById('bulkPricingToggle');
  var bulkPricingPanel = document.getElementById('bulkPricingPanel');
  var bulkPricingBody = document.getElementById('bulkPricingBody');

  // Bulk seat discount tiers, as a percentage off the selected course's base price
  var bulkTiers = [
    { label: '1', min: 1, discount: 0 },
    { label: '2 – 10', min: 2, discount: 0.01 },
    { label: '11 – 20', min: 11, discount: 0.02 },
    { label: '21 – 50', min: 21, discount: 0.03 },
    { label: '51 – 100', min: 51, discount: 0.05 },
    { label: '101 – 250', min: 101, discount: 0.07 },
    { label: '251 – 500', min: 251, discount: 0.08 },
    { label: '501 – 1,000', min: 501, discount: 0.10 }
  ];

  if (enrollForm && seatsInput && formTotal) {
    var basePrice = parseFloat(enrollForm.dataset.pricePerSeat);

    var tierFor = function (seats) {
      var match = bulkTiers[0];
      for (var i = 0; i < bulkTiers.length; i++) {
        if (seats >= bulkTiers[i].min) match = bulkTiers[i];
      }
      return match;
    };
    var priceForDiscount = function (discount) {
      return Math.round(basePrice * (1 - discount) * 100) / 100;
    };
    var renderBulkTable = function (activeTier) {
      if (!bulkPricingBody) return;
      bulkPricingBody.innerHTML = bulkTiers.map(function (tier) {
        var rowClass = tier === activeTier ? ' class="active"' : '';
        return '<tr' + rowClass + '><td>' + tier.label + '</td><td>$' + priceForDiscount(tier.discount).toFixed(2) + '</td></tr>';
      }).join('');
    };
    var updatePricing = function () {
      var seats = Math.max(1, parseInt(seatsInput.value, 10) || 1);
      var tier = tierFor(seats);
      var pricePerSeat = priceForDiscount(tier.discount);
      var discounted = pricePerSeat < basePrice;

      if (priceOriginal && priceAmount) {
        priceOriginal.hidden = !discounted;
        priceOriginal.textContent = '$' + basePrice.toFixed(2);
        priceAmount.textContent = '$' + pricePerSeat.toFixed(2);
      }
      var totalFormatted = (seats * pricePerSeat).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      formTotal.textContent = 'Total: $' + totalFormatted;

      renderBulkTable(tier);
    };
    seatsInput.addEventListener('input', updatePricing);

    if (bulkPricingToggle && bulkPricingPanel) {
      bulkPricingToggle.addEventListener('click', function () {
        var expanded = bulkPricingToggle.getAttribute('aria-expanded') === 'true';
        bulkPricingToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        bulkPricingPanel.hidden = expanded;
      });
    }

    if (courseSelect && courseName && courseHours) {
      var applyCourse = function () {
        var opt = courseSelect.options[courseSelect.selectedIndex];
        basePrice = parseFloat(opt.dataset.price);
        enrollForm.dataset.pricePerSeat = basePrice;
        courseName.textContent = opt.dataset.name;
        courseHours.textContent = opt.dataset.hours + ' of self-paced online training';
        updatePricing();
      };
      courseSelect.addEventListener('change', applyCourse);
    }

    updatePricing();
  }

  // Related training cards select their course and jump to the enroll form
  document.querySelectorAll('.related-card[data-course]').forEach(function (card) {
    card.addEventListener('click', function () {
      if (!courseSelect) return;
      courseSelect.value = card.dataset.course;
      courseSelect.dispatchEvent(new Event('change'));
    });
  });

  if (enrollForm && formSuccess) {
    enrollForm.addEventListener('submit', function (e) {
      e.preventDefault();
      enrollForm.hidden = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

});
