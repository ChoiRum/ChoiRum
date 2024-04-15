	// X-CSRF-TOKEN 값 - ajax 요청시 필요	
let val = $("meta[name='_csrf']").attr("content") ; 

let TOKEN = $("meta[name='_csrf']").attr("content");
//엑셀업로드 요소 선언
const parentElement = document.querySelector('#previewId');
let gbHeight = $('div.sem-row').innerHeight() / 1.55;
//frame tab 변경 시 anctlGrid 레이아웃 사라지는 현상 해결함수
function fn_refreshLayout() {
	anctlGrid.refreshLayout();
	return false;
}




//오버레이
let bHeight = $('body').innerHeight();
$(".overlay").css({ 'height': bHeight });

//모달 닫기 함수
function fn_modalClose() {
	$(".modal").hide();
	$(".overlay").hide();
}

	//모달닫기버튼클릭
	$(".modal-close").click(function() {
		fn_modalClose();
	});
	
	//엑셀업로드 클릭
	$("#excelUp_btn").click(function(){
		fn_excelUpload();
	});
	






function fn_acntlSearchModal() {
	$("#acntlSearchModal").css("display","block");
	$(".overlay").show();
	anctlGridModal.refreshLayout();
}

function fn_excelUpload() {
	$("#ex-upload").css("display","block");
	$(".overlay").show();
}

//회계연도
let today = new Date();
fn_addYearOpt("[name='searchAcntlYear']", today.getFullYear()-14, today.getFullYear()+5, today.getFullYear());
	


//조회 함수
function fn_search() {

	var params = {
			insttInfoId : $("#insttInfoId").val(), 
			searchAcntlYear  : $("#searchAcntlYear option:selected").val(),
			searchAcntlCode  : $("#searchAcntlCode").val(), 
			searchAcntlNm    : $("#searchAcntlNm").val(), 
			searchDebtorCrditSeCd : $("#searchDebtorCrditSeCd").val(), 
			searchAcntlLevel : $("#searchAcntlLevel").val()
		};

	return params;
}

//모달 그리드 조회 함수
function fn_searchAcntlModal() {

	let params = {
			insttInfoId : $("#insttInfoId").val(), 
			searchAcntlYear  : $("#searchAcntlYearModal option:selected").val(),
			searchAcntlCode  : $("#searchAcntlCodeModal").val(), 
			searchAcntlNm    : $("#searchAcntlNmModal").val(), 
			searchAcntlLevel : $("#searchAcntlLevelModal").val()
		};

	return params;
}


//검색 조회 함수
function fn_searchList(){
	 let params = fn_search();
	 // 조회 실행
	 anctlGrid.readData(1, params);
	anctlGrid.refreshLayout();
	
}

//모달 검색 조회 함수
function fn_searchModalList(){
	 let params = fn_searchAcntlModal();
	 // 조회 실행
	 anctlGridModal.readData(1, params);
	anctlGridModal.refreshLayout();
	
}

const Grid = tui.Grid;

Grid.setLanguage('ko');
	
	
	
	//커스텀에디터
	class CustomTextEditor {
      constructor(props) {
        const el = document.createElement('input');
        const { maxLength } = props.columnInfo.editor.options;

        el.type = 'text';
        el.maxLength = maxLength;
        el.value = el.value = String(props.value ? props.value: "");
		el.readonly = true;

        this.el = el;
      }

      getElement() {
        return this.el;
      }

      getValue() {
        return this.el.value;
      }

      mounted() {
        this.el.select();
      }
    }



	
	



	var anctlGrid = new tui.Grid({
		el : document.getElementById("anctlGrid"),
		scrollX: true,
		scrollY: true,
		bodyHeight: gbHeight,
		rowHeaders: [
        	{ type : 'checkbox', align : 'center', header : `
                <label for="all-checkbox" class="checkbox">
                <input type="checkbox" id="all-checkbox" class="hidden-input" name="_checked" />
                <span class="custom-input"></span>
              </label>
            `}],
		editingEvent : 'click',
		
		columns : [
					{header: '수정유무컬럼', name: 'status', hidden: true},
					{header: '기관(업체)ID', name: 'insttInfoId', hidden: true},
					{header: '회계연도', name: 'acntlYear', hidden: true},
					{header: '회계구분코드', name: 'acntgSeCd', hidden: true},
					{header: '회계계정과목_상위_연도', name: 'acntlUpperYear', hidden: true},
					{header: '회계계정과목 상위 코드', name: 'acntlUpperCode', hidden: true},
					{header: '회계계정과목 상위 코드 이름', name: 'acntlUpperNm', hidden: true},
					{header: '관리항목필수입력1', name: 'esntlYn1', hidden: true},
					{header: '관리항목필수입력2', name: 'esntlYn2', hidden: true},
					{header: '관리항목필수입력3', name: 'esntlYn3', hidden: true},
					{header: '관리항목필수입력4', name: 'esntlYn4', hidden: true},
					{header: '관리항목필수입력5', name: 'esntlYn5', hidden: true},
					{	  header: '계정레벨',
						  name: 'acntlLevel',
						  align : 'center'
						 
							},
					{	  header: '계정코드',
						  name: 'acntlCode',
				 		  sortingType: 'desc',
						  align : 'left'
						 
							},
							
					{	header: '계정명', 
						name: 'acntlNm',
						formatter: fn_acntlNmFormatter,
						width: 400,
						minWidth: 100,
						align : 'left'
						},
						
					{	header: '계정출력명', 
						name: 'acntlOtptNm',
						align : 'left'
						},
						
					{	header: '계정특성', 
						name: 'acntlType',
						formatter: fn_acntlTypeFormatter,
						align : 'left'
						},
						
					{	header: '차대구분', 
						name: 'debtorCrditSeCd',
						formatter: fn_debtorCrditSeCdFormatter,
						align : 'left'
						},
						
						
					{	header: '관리항목1', 
						name: 'cntrlCd1',
						align : 'left'
						},
						
					{	header: '관리항목2', 
						name: 'cntrlCd2',
						align : 'left'
						},
						
					{	header: '관리항목3', 
						name: 'cntrlCd3',
						align : 'left',
						hidden: true
						},
						
					{	header: '관리항목4', 
						name: 'cntrlCd4',
						align : 'left',
						hidden: true
						},
						
					{	header: '관리항목5', 
						name: 'cntrlCd5',
						align : 'left',
						hidden: true
						
						},
						
					{header: '계정별원장(보조부)항목1', name: 'subledger1', hidden: true},
					{header: '계정별원장(보조부)항목2', name: 'subledger2', hidden: true},
					{header: '사용 유무', name: 'useYn', hidden: true}
						
						],
/*	   columnOptions: { resizable: true },*/
		
		data: { 
		  	api: {
				readData: { url: "/acn/asm/acntlCtgManageList.do",method: "GET", initParams : fn_search()},
				modifyData: { url: "/acn/asm/acntlCtgManageModify.do", method: "POST"},
				deleteData: { url: "/acn/asm/acntlCtgManageDelete.do", method: "POST"}
			},
// 		initialRequest: false,   //데이터 실행메소드 
			contentType : 'application/json',
			headers: {'X-CSRF-TOKEN' : val} // ajax 요청시 꼭 필요
		}

	});//그리드 끝
	
//업로드 모달 그리드시작
let anctlGridExcel = new tui.Grid({
	el : document.getElementById("anctlGridExcel"),
	scrollX: true,
	scrollY: true,
	rowHeaders: ['rowNum'],
	editingEvent : 'click', 

	columns : [		{header: '기관(업체)ID', name: 'insttInfoId', hidden: true},
					{header: '회계연도', name: 'acntlYear' ,width: 50},
					{header: '회계구분코드', name: 'acntgSeCd',width: 80},
					{header: '상위연도', name: 'acntlUpperYear',width: 50},
					{header: '상위코드', name: 'acntlUpperCode',width: 100},
					{	  header: '계정레벨',
						  name: 'acntlLevel',
						  align : 'center'
						,width: 50
							},
					{	header: '계정코드',
						name: 'acntlCode',
				 		sortingType: 'desc',
						align : 'left',width: 100
							},

					{	header: '계정명', 
						name: 'acntlNm',
						formatter: fn_acntlNmFormatter,
						width: 100,
						align : 'left'
											},
											
					{	header: '계정출력명', 
						name: 'acntlOtptNm',
						align : 'left',width: 100
						},

					{	header: '계정특성', 
						name: 'acntlType',
						formatter: fn_acntlTypeFormatter,
						align : 'left',width: 100
											},
					{	header: '차대구분', 
						name: 'debtorCrditSeCd',
						formatter: fn_debtorCrditSeCdFormatter,
						align : 'left',width: 100
											},
					{header: '계정별원장(보조부)항목1', name: 'subledger1',width: 100},
					{header: '계정별원장(보조부)항목2', name: 'subledger2',width: 100},
					{header: '사용 유무', name: 'useYn', hidden: true}
						],
						
						data : {
							api: {
								readData: { url: "", method: "GET"},
								modifyData: { url: "/acn/asm/acntlCtgManageModify.do", method: "POST"},
							},
							contentType : 'application/json',
							headers: {'X-CSRF-TOKEN' : val} // ajax 요청시 꼭 필요
						}
});


// 상위계정모달 그리드시작
let anctlGridModal = new tui.Grid({
	el : document.getElementById("anctlGridModal"),
	scrollX: true,
	scrollY: true,
	bodyHeight: gbHeight,
	rowHeaders: ['rowNum'],
	editingEvent : 'click', 
	columns : [
		{header: '회계계정과목 상위 코드 이름', name: 'acntlUpperNm', hidden: true},
		{header: '기관(업체)ID', name: 'insttInfoId', hidden: true},
		{header: '회계년도', 
		 name: 'acntlYear', 
	     sortingType: 'desc', 
         sortable: false, 
         align:'center', 
        },
		{header: '계정레벨', 
		 name: 'acntlLevel', 
	     sortingType: 'desc', 
         sortable: false, 
         align:'center', 
        },
		{header: '계정코드', 
		 name: 'acntlCode', 
	     sortingType: 'desc', 
         sortable: false, 
         align:'center',
        },
		{header: '계정명', 
		 name: 'acntlNm', 
	     sortingType: 'desc', 
         sortable: false, 
         align:'center',
        }

	],
	data : {
		api: {
			readData: { url: "/acn/asm/acntlCtgManageModalList.do", method: "GET", initParams : fn_searchAcntlModal},
		},
		contentType : 'application/json',
		headers: {'X-CSRF-TOKEN' : val} // ajax 요청시 꼭 필요
	}
});
//상위계정모달 그리드 종료
	
	
	
 	  // row 행추가 버튼
      var addRowBtn = document.getElementById('addRowBtn');
      addRowBtn.addEventListener('click', function() {
      	// 앞에 추가
		anctlGrid.appendRow({
						"status":"I",
						"insttInfoId":$("#insttInfoId").val(),
						"acntlYear" : $("#searchAcntlYear option:selected").val(),
						"acntgSeCd" : "",
						"acntlUpperCode" : "",
						"acntlUpperYear" : "",
						"subledger1" : "",
						"subledger2" : "",
						"acntlLevel" : 1,
						"acntlCode" : "",
						"acntlNm" : "",
						"acntlOtptNm" : "",
						"debtorCrditSeCd" : "",
						"acntlType" : "",
						"blhtOutptAt" : "",
						"plosdocOutptAt" : "",
						"tiablOutptAt" : "",
						"useYn" : "Y",
						"cntrlCd1" : "",
						"cntrlCd2" : "",
						"cntrlCd3" : "",
						"cntrlCd4" : "",
						"cntrlCd5" : "",
						"esntlYn1" : "N",
						"esntlYn2" : "N",
						"esntlYn3" : "N",
						"esntlYn4" : "N",
						"esntlYn5" : "N"
						},
						{focus: true}); 
						

      });

      // row 삭제 버튼 DeleteRow
      var removeRowBtn = document.getElementById('removeRowBtn');
      removeRowBtn.addEventListener('click', function() {
    	  anctlGrid.removeCheckedRows(true); //true일때 취소시 삭제 안됨.
		  anctlGrid.request('deleteData', {checkedOnly:true, showConfirm : false}); //showConfirm: 알림 제거
		  anctlGrid.clearModifiedData();

      });
	
/*let colorClassCk = document.getElementsByClassName('cell-Color').classList.remove('cell-Color');*/
/*let colorClassCk = document.getElementsByClassName('cell-Color');

		if(colorClassCk){
			anctlGrid.removeRowClassName(ev.rowKey, 'cell-Color');//row에 class이름 삭제
			cellColorCk = false;
			console.log("제거완료");
		}
		
		if(!cellColorCk){
			anctlGrid.addRowClassName(ev.rowKey, 'cell-Color');//row에 class이름을 주어서 색상을 변경함 색상은 스타일로 지정함
			cellColorCk = true;
			console.log("되냐");
		}*/
		

/*클릭시 셀 인풋 함수 시작*/	
let cellColorCk = false; //셀 컬러 체크 토글
let rowCk = null; //로우체크 로우키 담는 변수
let allBoxCk = 0; //올 체크 박스 체크여부 토글
let inputCkClass = document.getElementsByClassName('inputCkClass');// 인풋 입력여부 클래스
let ckBoxClass = document.getElementsByClassName('ckBox');// 인풋 입력여부 클래스
const className = 'cell-Color'; //클래스네임
// 입력 필드 초기화 함수
function resetFields() {
  for (let i = 0; i < inputCkClass.length; i++) {
    	inputCkClass[i].value = '';
	
	}

  for (let v = 0; v < ckBoxClass.length; v++) {
    	ckBoxClass[v].checked = false;
		ckBoxClass[v].value = 'N';	
	}
  
};

let selectedRowKey = null; // 선택된 row의 key를 저장하는 변수

anctlGridModal.on('click',(evClick) => {
	let rowKey = evClick.rowKey;
	
	let anctlGridModalVal = anctlGridModal.getRow(rowKey, evClick.row);
	$("#anctlGridSelectBtn").on('click', function(){
		fn_addAnctlGrid(rowCk, anctlGridModalVal);
	});
});

function fn_addAnctlGrid(rowCk,anctlGridModalVal){
	if(anctlGridModalVal !== null){
		anctlGrid.setValue(rowCk, 'acntlUpperYear', anctlGridModalVal.acntlYear);
		anctlGrid.setValue(rowCk, 'acntlUpperCode', anctlGridModalVal.acntlCode);
		anctlGrid.setValue(rowCk, 'acntlUpperNm', anctlGridModalVal.acntlNm);
		anctlGrid.setValue(rowCk, 'acntlLevel', (((Number)(anctlGridModalVal.acntlLevel))+1));
		nameSetFields();
		fn_modalClose();
	}
}

//이름을 기준으로 입력폼에 클릭한 인풋의 value 넣기
function nameSetFields() {
	
	let allCkBoxCk = document.getElementById("all-checkbox");
	let allCkBoxNmCk = document.getElementsByName("_checked");
	
	//올체크박스 체크 
	if(allCkBoxCk.checked){
		for(let i=0; i < (allCkBoxNmCk.length - 1); i++){
			anctlGrid.addRowClassName([i], className);
			anctlGrid.check([i])
		}	
		allBoxCk = 1;
		resetFields();
	}	
	
	//올체크박스 체크해제
	if(!allCkBoxCk.checked && allBoxCk == 1){
		for(let j=0; j < (allCkBoxNmCk.length - 1); j++){
			anctlGrid.removeRowClassName([j], className);
			anctlGrid.uncheck([j])
		}
			allBoxCk = 0;
			resetFields();
	}	
	
		let getGridRow =  anctlGrid.getRow(rowCk);
		
  for (let k = 0; k < inputCkClass.length; k++) {
	
    let names = inputCkClass[k].name;
		for(let getName in getGridRow)  {
			if(names == getName){
				inputCkClass[k].value = getGridRow[getName];
			}
		}
		
  }

for (let z = 0; z < ckBoxClass.length; z++) {
			if(ckBoxClass[z].value  == "Y"){
				ckBoxClass[z].checked = true;
			}else{
				ckBoxClass[z].checked = false;
			}	
		}

}

//이벤트 추가 함수
function handleRowClickSet(ev) {

	let status = anctlGrid.getValue(ev.rowKey, 'status');
	
	if(status == "I"){
		$("#acntlUpperNm").attr("readonly", true);
		document.getElementById('acntlUpperNm').removeAttribute('disabled');
	}else{
		$("#acntlUpperNm").attr("readonly", false);
		document.getElementById('acntlUpperNm').setAttribute('disabled', 'disabled');
	}

	if (rowCk !== null){
		for (let i = 0; i < inputCkClass.length; i++) {
		    if (rowCk === null) {
                // rowCk가 null인 경우 이벤트 리스너 등록을 중지시킴
                continue;
            }
		// 키 다운 이벤트 리스너
		inputCkClass[i].addEventListener('keydown', fn_cellInput);
		// 셀렉트박스 이벤트 리스너
		inputCkClass[i].addEventListener('change', fn_cellInput);
		// 포커스 이벤트 리스너
		inputCkClass[i].addEventListener('blur', fn_cellInput);
		
		}
		
	}

}



//셀인풋 함수
function fn_cellInput(event) {
		      let cellName = this.name;
		      let cellClass = this.className;
		      let cellValue = this.value;

			    if (cellClass.indexOf('ckBox') !== -1 && this.checked) {
				    cellValue = 'Y';
				  } 
		if (cellClass.indexOf('ckBox') !== -1 && !(this.checked)) {
				    cellValue = 'N';
				  }
			  anctlGrid.setValue(rowCk, cellName, cellValue);
		  }

//클릭한 셀 선택하기 함수
function handleRowClick(ev) {
    const rowKey = ev.rowKey;
    const hasClass = anctlGrid.getRowClassName(rowKey).includes(className);
	
	let status = anctlGrid.getValue(ev.rowKey, 'status');
	if(status == "I"){
		$("#acntlCode").attr("readonly", false);
	}else{
		$("#acntlCode").attr("readonly", true);
	}
		

	//클릭한 row에 'cell-Color'가 없는경우 추가
	if(!hasClass) {
		rowCk = ev.rowKey;
		nameSetFields();
		handleRowClickSet(ev);
        anctlGrid.addRowClassName(rowKey, className);
		anctlGrid.check(rowKey);
    }
	
	//클릭한 row에 'cell-Color'가 적용된 경우 삭제
    if (hasClass) {
        anctlGrid.removeRowClassName(rowKey, className);
        anctlGrid.uncheck(rowKey);
		rowCk = null;
		resetFields();//폼 인풋 리셋
		// 이벤트 리스너 제거
		for (let i = 0; i < inputCkClass.length; i++) {
			inputCkClass[i].removeEventListener('keydown', fn_cellInput);
			inputCkClass[i].removeEventListener('change', fn_cellInput);
			inputCkClass[i].removeEventListener('blur', fn_cellInput);
		}
		

    } 
}

	//상위회계계정버튼 클릭
	$("#acntlUpCd_Btn").click(function(){
		let status = anctlGrid.getValue(rowCk, 'status');
		if(status == "I"){
			fn_acntlSearchModal();
		}else{
			alert("상위 회계계정은 수정할 수 없습니다.");
		}
	});


//클릭한 셀 선택하기 ()그리드 클릭이벤트)
anctlGrid.on('click', handleRowClick);






//클릭한 셀 선택하기 ()그리드 클릭이벤트)
anctlGridModal.on('click', test22);*/

//클릭한 셀 선택하기 ()그리드 클릭이벤트)
anctlGridModal.on('dblclick', (evClick)=>{
	let anctlGridVal = anctlGridModal.getRow(evClick.rowKey, evClick.row);
	
	anctlGrid.setValue(rowCk, 'acntlUpperYear', anctlGridVal.acntlYear);
	anctlGrid.setValue(rowCk, 'acntlUpperCode', anctlGridVal.acntlCode);
	anctlGrid.setValue(rowCk, 'acntlUpperNm', anctlGridVal.acntlNm);
	anctlGrid.setValue(rowCk, 'acntlLevel', (((Number)(anctlGridVal.acntlLevel))+1));
	nameSetFields();
	fn_modalClose();
	evClick.stop();
	
});

$("#acntlCode").on('keyup', function(){
	$(this).val($(this).val().replace(/[^0-9]/g,''));
});

$("#acntlNm").on('keyup', function(){
	$(this).val($(this).val().replace(/[^\d\wㄱ-ㅎㅏ-ㅣ가-힣]/g, ''));
});
/*클릭시 셀 인풋 함수 종료*/	


		//셀 값 초기화 + 편집모드 스타트 함수
		function fn_reSet(ev){
		    anctlGrid.setValue(ev.rowKey, ev.columnName, '');
			anctlGrid.startEditing(ev.rowKey, ev.columnName);
		}	


		//포멧터
		function fn_acntlNmFormatter(v) {
			let value = v.value;
/*			console.log(value,"(계정명포멧)");
			console.log(v.row.acntlLevel,"레벨");*/
				let tmp = '';
			if(value !== null || value !== ""){
				if(((Number)(v.row.acntlLevel)) != 1){
					for(let f = 0; f<((Number)(v.row.acntlLevel)); f++){
						tmp += '　';
						/*console.log(tmp+"템프찍기1");
						console.log("로그"+[i]+"번째도는중");*/
					}
					 tmp += value;
				
				}else{
					tmp = value;
				}
			}
			return tmp;
		}
		
		
		
		
		
		
		function fn_debtorCrditSeCdFormatter(v){
			  // 셀렉트박스의 텍스트값 가져오기
			let valueV = v.value
			
			for (let option of document.getElementById("debtorCrditSeCd").options) {
				if(option.value == valueV){
					return valueV !== "" ? option.text : ""; 
				}
			}
		}
		
		
			function fn_acntlTypeFormatter(v){
			 // 셀렉트박스의 텍스트값 가져오기
			let valueV = v.value
			
			for (let option of document.getElementById("acntlType").options) {
				if(option.value == valueV){
					return valueV !== "" ? option.text : ""; 
				}
			}
		}
		
		
		
		
		
		//저장 fn
		function fn_save() {
			 anctlGrid.request('modifyData');
			 anctlGrid.clearModifiedData(); //데이터 초기화
			 anctlGrid.readData(0);
			 anctlGrid.refreshLayout();
	}
		
	//저장
	 let saveBtn = document.getElementById('saveBtn');




    saveBtn.addEventListener('click', e =>{
		e.stopPropagation();//버블막기
		//목세목코드 공백 체크
		anctlGrid.finishEditing(anctlGrid.rowKey, anctlGrid.getColumn); //에디팅 종료시키기
		anctlGrid.blur();// 그리드 포커스 지우기 ( finishEditing 이랑 같이써야함)
			let acntlCode = nullCheck(anctlGrid.getColumnValues('acntlCode'));
			let acntlNm = nullCheck(anctlGrid.getColumnValues('acntlNm'));
			let acnCrdiSeCD = nullCheck(anctlGrid.getColumnValues('debtorCrditSeCd'));
			
		if(!acntlCode.indexOf("")){
				alert("회계계정코드를 입력해주세요.");
				return ;
			}
			
			if(!acntlNm.indexOf("")){
				alert("회계계정명을 입력해주세요.");
				return ;
			}
			
			if(!acnCrdiSeCD.indexOf("")){
				alert("차대구분을 선택해주세요.");
				return ;
			}
			
						//상위회계계정 중복검증	
			const selColumn = anctlGrid.getColumnValues('acntlCode');
			//공백제거
			filtered  = selColumn.filter(function(item) {
			 return item !== null && item !== undefined && item !== '';
			});
			//set으로 중복제거
			const selColumnSet = new Set(filtered);

			//회계계정 중복 길이 비교
			if(filtered.length !== selColumnSet.size  ){
            		alert("회계계정코드는 중복될 수 없습니다.");
					document.getElementById("acntlCode").value = "";
					anctlGrid.setValue(rowCk, "acntlCode", '');              
            		return;
				}
			fn_save();
			fn_searchList();
} );


function removeDuplicateByCode(arr) {
  const codeSet = new Set(); // 중복코드를 추적하기 위한 Set

  return arr.filter((subArr, index) => {
    const code = subArr[5]; // 코드는 6 번째 요소로 가정

    if (!codeSet.has(code)) {
      codeSet.add(code);
      return true;
    }

    return false;
  });
}



//엑셀 시트 내부 하위 배열의 원소 공백을 제거 + 중복 제거(중복이 5개면 4개를 지우고 1개의 요소만 남겨둠)
function removeEmptyValues(arr) {
  const filteredArr = removeDuplicateByCode(arr); // 중복된 코드 제거

  return filteredArr.filter((subArr, index) => {
    return (
      filteredArr.findIndex((value) => JSON.stringify(value) === JSON.stringify(subArr)) === index &&
      subArr.filter((value) => {
        if (typeof value === 'string') {
          return value.trim().length > 0; // 공백 코드 제거
        } else {
          return typeof value !== 'string';
        }
      }).length > 0
    );
  });
}





//업로드시 실행
function fn_acntlCodeExcelUploadData (sheetData) {
				
				let deleteOnCk = false;//삭제여부
				let codeOnCk = false;//중복체크
				

				let deletedRowProcessed = false; //중복삭제코멘트 1번만 실행
				let nullCk = 0; //공백 입력으로 인해 삭제된 행숫자
				let stringCk = 0; //문자 입력으로 인해 삭제된 행숫자
				let acntlDbCk = 0; //DB와 중복된 코드로 인해 삭제된 행숫자
				
	
				
				//공백시트 배열제거, 중복제거 배열 재생성
				const filteredSheetData = removeEmptyValues(sheetData);
				const removedCount = ((sheetData.length) - (filteredSheetData.length));
				
				
				filteredSheetData.forEach((item, index) => {
				  if (index === 0){return;} // 머리글 행 스킵(첫행)
				 
				  //배열 비구조화 할당
				  const [acntlYear, acntgSeCd,acntlUpperYear, acntlUpperCode
				, acntlLevel,acntlCode, acntlNm, acntlOtptNm, acntlType
				, dtCrditSeCd, sbledger1, sbledger2 , acntlusYn] = item;
				  
					
				  acntlCodeCk = String(acntlCode).trim();//공백제거
		
				   //숫자판별 숫자가 스킵! 필요시 해당부분은 정규화로 치환해서 벨리데이션잡을수있음
				  if(Number.isNaN(Number(acntlCodeCk))){
					stringCk ++ 
					return;
				}  
				
				
				   
				
				  // acntgAcntlCode 비어있는 행 스킵
				  if ( acntlCodeCk === undefined || acntlCodeCk === null || acntlCodeCk === "" || acntlCodeCk === 0){
					 nullCk++
					 return; 
				} 
				
		
				
				//목세목코드 중복검증	(메인 리스트)
				const selColumn = anctlGrid.getColumnValues('acntlCode');

				//공백제거
				filtered  = selColumn.filter(function(item) {
				 return item !== null && item !== undefined && item !== '';
				});

				//set으로 중복제거
				const selColumnSet = new Set(filtered);
				const arr = Array.from(selColumnSet);
				

				
		/*		arr.forEach((item, index) => {
				// item 변수는 배열 각각의 요소들을 순환합니다.
				console.log("반복문실행입니다"+arr[index]);
				
				if(acntlCode === arr[index]){
					
					 return false;
				} 
				
				 });*/
				
			 for (const item of arr) {
			  /*console.log("반복문 실행입니다" + item);*/
			  codeOnCk = false;//코드중복체크
			  if (acntlCode == item) {
			     codeOnCk = true; 
				 deleteOnCk = true;
				 acntlDbCk++
			    break; // 중복된 값이 있으면 반복문 종료
			  }
			}
		

				//목세목코드 중복이 존재하는 행이있으면 행추가 스킵
				if(!codeOnCk){	
				
				//업로드모달 미리보기 그리드 행추가	
				 anctlGridExcel.appendRow({
						"insttInfoId":$("#insttInfoId").val(),
						"acntlYear" : $("#searchAcntlYear option:selected").val(),
						"acntgSeCd" : acntgSeCd,
						"acntlUpperYear" : acntlUpperYear,
						"acntlUpperCode" : acntlUpperCode,
						"acntlLevel" : acntlLevel,
						"acntlCode" : acntlCode,
						"acntlNm" : acntlNm,
						"acntlOtptNm" : acntlOtptNm,
						"acntlType" : acntlType,
						"debtorCrditSeCd" : dtCrditSeCd,
						"subledger1" : sbledger1,
						"subledger2" : sbledger2,
						"useYn" : acntlusYn

						});//-- 맨 뒤에 추가
						
					}
				});
				
				//삭제된 행이 있을시 코멘트on
				if(deleteOnCk && !deletedRowProcessed){
					deletedRowProcessed = true;
					const pElement = document.createElement('span');
					pElement.textContent = '계정코드는 중복될 수 없어 중복된 행은 삭제되었습니다.';
					pElement.style.color = 'red';
					parentElement.append(pElement);
				}
				
				//시트내에 중복된행으로 걸러진 행이 있을시 코멘트on
				if(removedCount > 0){
					deletedRowProcessed = true;
					const pElement = document.createElement('span');
					pElement.textContent = '업로드된 엑셀시트에 계정코드가 중복된 '+removedCount+'개의 행은 삭제되었습니다.';
					pElement.style.color = 'blue';
					parentElement.append(pElement);
				}	
						
				//시트내에 형식에 맞지않아 걸러진 행이 있을시 코멘트on
				if(nullCk > 0 || stringCk > 0 || acntlDbCk > 0){
					deletedRowProcessed = true;
					const pElement = document.createElement('span');
					pElement.innerHTML = '엑셀시트내 형식에 맞지않아 삭제된행이 존재합니다.'+ '<br>'+"[공백입력 : "+nullCk
						+"건]   "+" [문자입력 : "+stringCk+"건]   "+"  [중복등록코드 : "+acntlDbCk+"건] ";
					pElement.style.color = 'Purple';
					parentElement.append(pElement);
				}	
		
	
				
	anctlGridExcel.refreshLayout();
}

//코멘트(span) 삭제 함수
function removeComment() {
 const spans = document.querySelectorAll('#previewId span');
  spans.forEach(span => {
    if (span.parentNode) {
      span.parentNode.removeChild(span);
    }
  });
}

//파일폰드 삭제함수
function filePondRemove(){
	//파일폰드 인풋태그를 할당한 파일폰드 인스턴스
	let inputElement = document.getElementById('acntlCodeExcelUpload');
	let pond = FilePond.find(inputElement, {
	//acceptedFileTypes 고정하기
    acceptedFileTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', '.xls', '.xlsx', 'application/haansoftxlsx']
}
);

	pond.removeFiles();
}


		//모달 확인
		$("#excelUp_BtnYes").click(() =>{
			 anctlGridExcel.request('modifyData');
			 anctlGridExcel.clear(); //엑셀업로드 그리드 클리어
			 removeComment();//span코멘트 제거
			 filePondRemove(); //파일폰드 업로드 파일 제거
			 anctlGridExcel.refreshLayout();
			 anctlGrid.refreshLayout();
			 anctlGrid.readData(0);
		});
		
		//모달 취소
		$("#excelUp_BtnCancel").click(() => {
			anctlGridExcel.clear();//엑셀업로드 그리드 클리어
			removeComment();//span코멘트 제거
			filePondRemove(); //파일폰드 업로드 파일 제거
			$("#ex-upload").css("display","none");
			$(".overlay").hide();
			anctlGridExcel.refreshLayout();
		});

	// 연차일수 엑셀다운로드
function fn_excelDown() {
	let columnNames = [
		/*회계연도, 회계구분,	상위회계계정연도, 상위회계계정코드, 회계계정코드	
		회계계정명	회계계정출력명	회계계정레벨	차대구분	계정특성	보조항목1	보조항목2	사용우무*/
		'acntlYear', 'acntgSeCd','acntlUpperYear','acntlUpperCode','acntlLevel', 'acntlCode',
		'acntlNm','acntlOtptNm','debtorCrditSeCd','acntlType','subledger1', 'subledger2','useYn'
	];
	const options = {
	  useFormattedValue: false, // format 된 데이터만 추출
	  onlyFiltered: false, // filter 된 데이터만 추출
	  columnNames: columnNames, // 엑셀파일에 보여줄 컬럼들 설정
	  fileName: '계정과목리스트_'+fn_excelDateFormat(today), // 엑셀파일명
	};
	//엑셀 내보내기 ('형태', '옵션')
	anctlGrid.export('xlsx', options);
}
	


	//엑셀다운로드 클릭
	$("#excelDown_btn").click(function(){
			fn_excelDown();
	});
	
	

	

		

		
		//FilePond 이벤트 중에 removefile 파일 삭제 이벤트(인풋에서 x버튼 눌러서 파일삭제시)
	document.addEventListener('FilePond:removefile', (e) => {
		anctlGridExcel.clear();//엑셀업로드 그리드 클리어
		removeComment();//span코멘트 제거
	})
	
	
	
	
	







		