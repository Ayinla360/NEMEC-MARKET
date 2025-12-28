(function() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const department = document.getElementById('department').value;
    const service = document.getElementById('service').value.trim();
    const profilePicFile = document.getElementById('profilePic').files[0];
    const productPicFile = document.getElementById('productPic').files[0];

    if (!name || !email || !phoneNumber || !department) {
      alert('Please fill all required fields');
      return;
    }

  const user = { name, email, phoneNumber, department, service, profilePic: '', productPic: '' };

  const attachLocationEl = document.getElementById('attachLocationUser');

    function saveUser(u) {
      const users = JSON.parse(localStorage.getItem('nemecUsers')) || [];
      users.push(u);
      localStorage.setItem('nemecUsers', JSON.stringify(users));
      alert('Registration successful!');
      form.reset();
    }

    // helper to finalize saving (after optionally getting geolocation and reading files)
    function finalizeSave() {
      // Read files if present, then save
      if (profilePicFile) {
        const reader1 = new FileReader();
        reader1.onload = function(ev) {
          user.profilePic = ev.target.result;

          if (productPicFile) {
            const reader2 = new FileReader();
            reader2.onload = function(ev2) {
              user.productPic = ev2.target.result;
              saveUser(user);
            };
            reader2.readAsDataURL(productPicFile);
          } else {
            saveUser(user);
          }
        };
        reader1.readAsDataURL(profilePicFile);
      } else if (productPicFile) {
        const reader2 = new FileReader();
        reader2.onload = function(ev2) {
          user.productPic = ev2.target.result;
          saveUser(user);
        };
        reader2.readAsDataURL(productPicFile);
      } else {
        saveUser(user);
      }
    }

    // if user opted to attach location, try to get it first
    if (attachLocationEl && attachLocationEl.checked && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        user.latitude = pos.coords.latitude;
        user.longitude = pos.coords.longitude;
        finalizeSave();
      }, function(err) {
        console.warn('Geolocation failed or denied:', err && err.message);
        finalizeSave();
      }, { enableHighAccuracy: false, timeout: 10000 });
    } else {
      finalizeSave();
    }
  });
})();