// 숫자 키패드 배열
var keypad = [
    ['C', 0, '<', 12, 16, 18],
    [7, 8, 9, 20, 22, 26],
    [4, 5, 6, 28, 32, 36],
    [1, 2, 3, 38, 60, 66]
];

// 숫자 키패드 생성 함수
function createKeypad() {
    var keypadDiv = document.getElementById('keypad');
    var inputBtn = document.getElementById('inputBtn');

    keypad.forEach(function (row) {
        var rowDiv = document.createElement('div');
        rowDiv.classList.add('keypad-row');

        row.forEach(function (number) {
            var button = document.createElement('button');
            button.innerText = number;
            button.classList.add('keypad-button');

            button.addEventListener('click', function () {
                var inputValue = inputBtn.innerText;

                if (number === '<') {
                    // 백스페이스 버튼 클릭 시 마지막 숫자 삭제
                    var newValue = inputValue.slice(0, -1);
                    inputBtn.innerText = newValue;
                } else if (number === 'C') {
                    // 취소 버튼 클릭 시 입력 값 초기화
                    inputBtn.innerText = '';
                } else {
                    // 숫자 버튼 클릭 시 입력 값 업데이트
                    if (parseInt(number) < 10) {
                        // 입력 값이 10 미만인 경우 추가로 입력
                        inputBtn.innerText += number.toString();
                    } else {
                        // 입력 값이 10 이상인 경우 기존 값을 대체
                        inputBtn.innerText = number.toString();
                    }
                }
            });

            rowDiv.appendChild(button);
        });

        keypadDiv.appendChild(rowDiv);
    });
}

// 페이지 로딩 시 숫자 키패드 생성
window.addEventListener('DOMContentLoaded', function () {
    createKeypad();
});

// 로컬 스토리지에서 데이터 가져오기
function getStoredData() {
    var data = localStorage.getItem('counterData');
    return data ? JSON.parse(data) : [];
}

// 데이터 저장
function saveData(data) {
    localStorage.setItem('counterData', JSON.stringify(data));
}

// downloadData 함수 정의
function downloadData() {
    var data = getStoredData();

    // 데이터를 CSV 형식으로 변환
    //var csvContent = 'data:text/csv;charset=utf-8,';
    var csvContent = '';
    csvContent += 'Index,Amount,Name,Created,Updated\n';
    data.forEach(function (row) {
        var rowData = [
            row.index,
            row.amount,
            row.name,
            row.createdAt,
            row.updatedAt
        ];
        //var rowContent = rowData.join(',');
        var rowContent = rowData.map(function (field) {
            return '"' + field + '"';
        }).join(',');
        csvContent += rowContent + '\n';
    });

    // 데이터를 Blob 객체로 생성
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // 다운로드 링크 생성
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'counter.csv';

    // 다운로드 실행
    link.click();
}

// 현재 일시(짧은 형식) 가져오기
function getCurrentTimestamp() {
    var now = new Date();
    var year = now.getFullYear().toString().slice(-2);
    var month = (now.getMonth() + 1).toString().padStart(2, '0');
    var day = now.getDate().toString().padStart(2, '0');
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    //
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 표 생성
function createTable(data) {
    var table = document.getElementById('dataTable');
    table.innerHTML = ''; // 기존 표 내용 초기화

    data.sort(function (a, b) {
        return b.index - a.index;
    });

    // 헤드 생성
    var thead = document.createElement('thead');
    var headRow = document.createElement('tr');
    var columnNames = ['Idx', 'Amount', 'Name', 'Time', 'Actions'];
    columnNames.forEach(function (columnName) {
        var th = document.createElement('th');
        th.textContent = columnName;
        if (columnName === 'Name') {
            th.classList.add('name-column'); // 컬럼 크기를 지정하는 클래스 추가
        }
        if (columnName === 'Amount') {
            th.classList.add('amount-column'); // 컬럼 크기를 지정하는 클래스 추가
        }
        th.addEventListener('click', function () {
            sortTable(columnName);
        });
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    // 바디 생성
    var tbody = document.createElement('tbody');
    data.forEach(function (row) {
        var tr = document.createElement('tr');

        var indexCell = document.createElement('td');
        indexCell.textContent = row.index;
        tr.appendChild(indexCell);

        var amountCell = document.createElement('td');
        amountCell.classList.add('amount-column');
        var amountInput = document.createElement('input');
        amountInput.classList.add('amount-column');
        amountInput.type = 'number';
        amountInput.value = row.amount;
        amountInput.disabled = true;
        amountCell.appendChild(amountInput);
        tr.appendChild(amountCell);

        var nameCell = document.createElement('td');
        nameCell.classList.add('name-column');
        var nameInput = document.createElement('input');
        nameInput.classList.add('name-column');
        nameInput.type = 'text';
        nameInput.value = row.name;
        nameInput.disabled = true;
        nameCell.appendChild(nameInput);
        tr.appendChild(nameCell);

        var dateTimeCell = document.createElement('td');
        dateTimeCell.style.display = 'flex';
        dateTimeCell.style.flexDirection = 'column';

        var createdAtSpan = document.createElement('span');
        var createdAtParts = row.createdAt.split(' ');
        createdAtSpan.textContent = 'C: ' + createdAtParts[createdAtParts.length - 1];
        dateTimeCell.appendChild(createdAtSpan);

        var updatedAtSpan = document.createElement('span');
        var updatedAtParts = row.updatedAt.split(' ');
        updatedAtSpan.textContent = 'U: ' + updatedAtParts[updatedAtParts.length - 1];
        dateTimeCell.appendChild(updatedAtSpan);

        tr.appendChild(dateTimeCell);

        var actionsCell = document.createElement('td');
        var editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('editBtn');
        editButton.dataset.index = row.index;
        actionsCell.appendChild(editButton);

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('deleteBtn');
        deleteButton.dataset.index = row.index;
        actionsCell.appendChild(deleteButton);

        tr.appendChild(actionsCell);

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // 수정 버튼 클릭 이벤트 등록
    var editButtons = document.getElementsByClassName('editBtn');
    Array.from(editButtons).forEach(function (editButton) {
        editButton.addEventListener('click', function () {
            var index = parseInt(this.dataset.index);
            var data = getStoredData();
            var rowData = data.find(function (row) {
                return row.index === index;
            });
            if (rowData) {
                // 편집 가능한 input 엘리먼트 생성
                var inputAmount = document.createElement('input');
                inputAmount.classList.add('amount-column');
                inputAmount.type = 'number';
                inputAmount.value = rowData.amount;

                var inputName = document.createElement('input');
                inputName.classList.add('name-column');
                inputName.type = 'text';
                inputName.value = rowData.name;

                // 셀 내용을 input 엘리먼트로 대체
                var amountCell = this.parentNode.previousElementSibling;
                amountCell.innerHTML = '';
                amountCell.appendChild(inputAmount);

                var nameCell = amountCell.previousElementSibling;
                nameCell.innerHTML = '';
                nameCell.appendChild(inputName);

                // 수정 버튼을 저장 버튼으로 변경
                this.textContent = 'Save';
                this.classList.remove('editBtn');
                this.classList.add('saveBtn');

                // 저장 버튼 클릭 이벤트 등록
                this.addEventListener('click', function () {
                    // 변경된 값 저장
                    rowData.amount = parseInt(inputAmount.value);
                    rowData.name = inputName.value;
                    rowData.updatedAt = getCurrentTimestamp();
                    saveData(data);
                    createTable(data);
                });
            }
        });
    });
    // 삭제 버튼 클릭 이벤트 등록
    var deleteButtons = document.getElementsByClassName('deleteBtn');
    Array.from(deleteButtons).forEach(function (deleteButton) {
        deleteButton.addEventListener('click', function () {
            var confirmDelete = confirm('Are you sure?');
            if (confirmDelete) {
                var index = parseInt(this.dataset.index);
                var data = getStoredData();
                var newData = data.filter(function (row) {
                    return row.index !== index;
                });
                saveData(newData);
                createTable(newData);
            }
        });
    });

    // 금액의 총합 계산
    var totalAmount = data.reduce(function (total, row) {
        return total + row.amount;
    }, 0);

    // 금액의 총합 표시
    var totalAmountElement = document.getElementById('totalAmount');
    totalAmountElement.textContent = 'Total Amount: ' + totalAmount;

    // 다운로드 버튼

    var oldDownloadButton = document.querySelector('.downloadBtn'); // 기존 다운로드 버튼 가져오기

    if (oldDownloadButton) {
        // 기존 다운로드 버튼이 존재하는 경우 제거
        oldDownloadButton.parentNode.removeChild(oldDownloadButton);
    }

    var downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    downloadButton.classList.add('downloadBtn');
    totalAmountElement.parentNode.insertBefore(downloadButton, totalAmountElement.nextSibling);

    // 다운로드 버튼 클릭 이벤트 등록
    downloadButton.addEventListener('click', function () {
        downloadData();
    });

    
    // 표 정렬
    function sortTable(columnName) {
        var table = document.getElementById('dataTable');
        var rows = Array.from(table.rows).slice(1); // 헤드 제외한 행들만 가져옴

        rows.sort(function (rowA, rowB) {
            var valueA = rowA.cells[columnName === 'Index' ? 0 : 1].textContent;
            var valueB = rowB.cells[columnName === 'Index' ? 0 : 1].textContent;

            if (columnName === 'Index') {
                return parseInt(valueA) - parseInt(valueB);
            } else {
                return parseFloat(valueA) - parseFloat(valueB);
            }
        });

        // 내림차순인 경우 반대로 정렬
        if (table.lastSortedColumn === columnName && table.lastSortOrder === 'desc') {
            rows.reverse();
            table.lastSortOrder = 'asc';
        } else {
            table.lastSortOrder = 'desc';
        }

        // 정렬된 행들을 다시 표에 추가
        rows.forEach(function (row) {
            table.appendChild(row);
        });

        table.lastSortedColumn = columnName;
    }
}
// 초기 데이터 로드
window.addEventListener('DOMContentLoaded', function () {
    var data = getStoredData();
    createTable(data);
});


// 캐시 지우기 버튼 생성
var totalAmountElement = document.getElementById('totalAmount');
var clearCacheButton = document.createElement('button');
clearCacheButton.textContent = 'Clear Cache';
clearCacheButton.classList.add('clearCacheBtn');
//totalAmountElement.parentNode.insertBefore(clearCacheButton, totalAmountElement.previousSibling);
totalAmountElement.parentNode.insertBefore(clearCacheButton, totalAmountElement.nextSibling);

// 캐시 지우기 버튼 클릭 이벤트 핸들러
clearCacheButton.addEventListener('click', function () {
    if (caches && caches.keys) {
      caches.keys().then(function (cacheNames) {
        cacheNames.forEach(function (cacheName) {
          caches.delete(cacheName);
        });
      });
    }
    
    // 페이지 리플레시
    location.reload();
  });
  
// 입력 버튼 클릭 이벤트 핸들러
document.getElementById('inputBtn').addEventListener('click', function () {
    var inputValue = document.getElementById('inputBtn').innerText;
    var amount = parseInt(inputValue + '00');
    var createdAt = getCurrentTimestamp();
    var data = getStoredData();
    var newData = {
        index: data.length + 1,
        name: '',
        amount: amount,
        createdAt: createdAt,
        updatedAt: createdAt,
        description: ''
    };
    data.push(newData);
    saveData(data);
    createTable(data);
});

// 로드 버튼 클릭 이벤트 핸들러
document.getElementById('loadBtn').addEventListener('click', function () {
    var data = getStoredData();
    createTable(data);
});