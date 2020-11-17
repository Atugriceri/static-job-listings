const contentContainer = document.getElementById('container');
const filterBar = document.getElementById('filterbar');
const filters = document.getElementById('filters');
let filterList = [];

function getData() {
  return new Promise((resolve, reject) => {
    fetch('./data.json')
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

function checkFilter(compareList) {
  return filterList.every((el) => compareList.indexOf(el) >= 0);
}

async function renderMainContent() {
  contentContainer.innerHTML = '';
  const data = await getData();
  data.forEach((item) => {
    const itemFilters = [item.role, item.level, ...(item.languages || []), ...(item.tools || [])];
    if (filterList.length === 0 || checkFilter(itemFilters)) {
      let filterContent = '';
      itemFilters.forEach((filter) => {
        filterContent += `<button type="button" class="btn filter" onclick="filter(this)" data-value="${filter}">${filter}</button>`;
      });
      const infoNew = item.new ? `<div class="badge badge-pill bg-green">New!</div>` : '';
      const infoFeatured = item.featured ? `<span class="badge badge-pill bg-black">Featured</span>` : '';
      contentContainer.innerHTML += `
      <div class="row mb-5 p-2 shadow">
      <div class="col-md-2">
        <img src="${item.logo}" alt="logo-${item.company}"/>
      </div>
      <div class="col-md-4">
        <div class="row card-head">
          <h3>${item.company}</h3>
          ${infoNew}
          ${infoFeatured}
        </div>
        <div class="row">
          <h2>${item.position}</h2>
        </div>
        <div class="row">
          <div class="status">${item.postedAt} &centerdot;
          </div>
          <div class="status">${item.contract} &centerdot;
          </div>
          <div class="status">${item.location}</div>
        </div>
      </div>
      <hr class="divider">
      <div class="col-md-6 filters">
        ${filterContent}
      </div>
    </div>`;
    }
  });
}

function renderFilterBar() {
  if (filterList.length === 0) {
    filterBar.classList.remove('show');
    filterBar.classList.add('hide');
  } else {
    filterBar.classList.remove('hide');
    filterBar.classList.add('show');
  }
  const filterBarContent = filterList.map(
    (filter) =>
      `<div class="filter-btn" data-value="${filter}" onclick="filter(this)"><p>${filter}</p><div><i class="fas fa-times"></i></div></div>`
  );
  filters.innerHTML = '';
  filterBarContent.forEach((item) => {
    filters.innerHTML += item;
  });
  renderMainContent();
}

function filter(element) {
  const filterValue = element.getAttribute('data-value');

  if (filterList.includes(filterValue)) {
    filterList = filterList.filter((filter) => filter !== filterValue);
    renderFilterBar();
  } else {
    filterList.push(filterValue);
    renderFilterBar();
  }
}

document.getElementById('clear').addEventListener('click', () => {
  filterList = [];
  renderFilterBar();
});

(function () {
  renderMainContent();
})();