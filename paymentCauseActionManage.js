

/*클릭시 셀 인풋 함수 시작*/	
let cellColorCk = false; 												// 셀 컬러 체크 토글
let rowCk = null; 														// 로우체크 로우키 담는 변수
let allBoxCk = 0; 														// 올 체크 박스 체크여부 토글
let inputCkClass = document.getElementsByClassName('inputCkClass');		// 인풋 입력여부 클래스
let ckBoxClass = document.getElementsByClassName('ckBox');				// 인풋 입력여부 클래스
const className = 'cell-Color'; 										// 클래스네임
let bgtCrtrCk = "";                                                     //프로젝트 사용여부 체크하는 전역변수
let unprVal = 0;  //단위 금액
let pcsActnAmtVal = 0;  //원인행위 금액
let vatVal = 0;  //부가세 금액
let bHeight = $('body').innerHeight();
let gbHeight = $('div.sem-row').innerHeight() / 1.55;

// X-CSRF-TOKEN 값 - Grid Ajax 요청시 필요
let TOKEN = $("meta[name='_csrf']").attr("content");
function ckTest() {
	alert("개발중인 기능 입니다.")
}


//frame tab 변경 시 anctlGrid 레이아웃 사라지는 현상 해결함수
function fn_refreshLayout() {
	//getData로 if 체크하면 그리드가 생성된경우에만 리프래쉬함
	if(expRptReferenceGrid.getData){
		expRptReferenceGrid.refreshLayout();
	}
	if(pcaDetailGrid.getData){
		pcaDetailGrid.refreshLayout();
	}
	if(pcaSearchListGrid.getData){
		pcaDetailGrid.refreshLayout();
	}
}

$(".overlay").css({ 'height': bHeight });

let yyyymmdd = "";


let expRptReferenceGrid = tui.Grid;
expRptReferenceGrid.setLanguage('ko');

let pcaDetailGrid = tui.Grid;
pcaDetailGrid.setLanguage('ko');

let pcaSearchListGrid = tui.Grid;
pcaSearchListGrid.setLanguage('ko');

function fn_formatDate( date ){
	
	let yyyy = date.getFullYear();
	let mm = String(date.getMonth() +1).padStart(2, '0');
	let dd = String(date.getDate()).padStart(2, '0');
	
	return yyyy + '-' + mm + '-' + dd;
}



//검색 조회 함수
function fn_searchList2(){
	pcaSearchListGrid.refreshLayout();
	 var params = fn_searchParam('pcaSearchListGrid');
	 // 조회 실행
	 pcaSearchListGrid.readData(1, params, true);
	
}

//검색 조회 함수
function fn_searchList(){
	expRptReferenceGrid.refreshLayout();
	 var params = fn_searchParam('rptReferenceSearchGrid');
	 // 조회 실행
	 expRptReferenceGrid.readData(1, params, true);
	
}



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


//데이트피커
$(function(){
	
	let today = new Date();
	
	$("#pcaYmd").datepicker({
		dateFormat: 'yy-mm-dd'
	}).datepicker("setDate", today);
	
	//원인행위모달
	$("#pcaSearchStartDe").datepicker({
		onClose: function(selectedDate) {
			$(pcaSearchEndDe).datepicker("option", "minDate", selectedDate);
	  	}
	});
	
	$("#pcaSearchEndDe").datepicker({
		onClose: function(selectedDate) {
			$(pcaSearchStartDe).datepicker("option", "maxDate", selectedDate);
	  	}
	});
	
	//지출품의참조모달
	$("#rptReferenceStartDe").datepicker({
		onClose: function(selectedDate) {
			$(rptReferenceEndDe).datepicker("option", "minDate", selectedDate);
	  	}
	});
	
	$("#rptReferenceEndDe").datepicker({
		onClose: function(selectedDate) {
			$(rptReferenceStartDe).datepicker("option", "maxDate", selectedDate);
	  	}
	});
	
	
	

	
	yyyymmdd = $("#pcaYmd").val();	
	
	
	//최초 접속시 사용자의 기관의 프로젝트 사용여부 변수를 할당
	
});

function fn_orgChartAdd(se){
	
	switch( se ){
		
		case "dept":
			let deptInfo = orgChartUtils.getSelectDeptInfo('deptSeachArea');
			console.log(deptInfo,"부서");
			$("#deptCode").val(deptInfo.deptcode);
			$("#deptNm").val(deptInfo.deptnm);
			fn_modalToggle('deptSearchModal', 'close');
		break;
		
		
		case "emp":
			let empInfo = orgChartUtils.getSelectUserInfo('empSearchArea');
			
			if( 1 < empInfo.length ){
				alert("작성자는 한 명만 추가 가능합니다.");
				return false;
			}
			console.log(empInfo,"직원");
			$("#userInfoId").val(empInfo[0].userInfoId);
			$("#userInfoNm").val(empInfo[0].userNm);
			
			fn_modalToggle('empSearchModal', 'close');
		break;
		
		
		default:
			alert("필요한 값이 누락되었습니다.");
			return false;	
	}}






function fn_modalToggle(id, se){
	
	if( se == "open" ){
		$(".overlay").show();
		$("#"+id).css("display","block");
	}
	else if( se == "close" ){
		if( id != "searchDeptModal2" && id != 'searchDeptModal5' ){
			$(".overlay").hide();
			$('#searchSe').val("");
			$('#searchTextInput').val("");
			$('#searchSeRptModal').val("");
			$('#searchInput').val("");
		}
		$("#"+id).css("display","none");
	}
	
	return false;
	
}

//그리드파람
function fn_searchParam( se ){
	
	let param = new Object();
	
	switch( se ){
		
		case "searchExpndRptGrid":
			param.searchStartDe     =  $("#rptReferenceStartDe").val();
			param.searchEndDe       =  $("#rptReferenceEndDe").val();
			param.approvalStatus	=  $("#searchApprovalStatus").val();
			param.searchSe  		=  $("#searchSe").val();
			param.searchText        =  $("#searchText").val();
		break;
		
		//품의참조 그리드 파라미터
		case "rptReferenceSearchGrid":
			param.searchStartDe     =  $("#rptReferenceStartDe").val();
			param.searchEndDe       =  $("#rptReferenceEndDe").val();
			param.insttInfoId         =  $("#insttInfoId").val();
			param.bplcInfoId          =  $("#bplcInfoId").val();
			param.rptReferenceStartDe =  $("#rptReferenceStartDe").val();
			param.rptReferenceEndDe   =  $("#rptReferenceEndDe").val();
			param.searchSeRptModal    =  $("#searchSeRptModal").val();
			param.searchRptText        =  $("#searchInput").val();
		break;
		
		//원인행위검색 파라미터
		case "pcaSearchListGrid":
			param.insttInfoId         =  $("#insttInfoId").val();
			param.bplcInfoId          =  $("#bplcInfoId").val();
			param.pcaSearchStartDe 	  =  $("#pcaSearchStartDe").val();
			param.pcaSearchEndDe 	  =  $("#pcaSearchEndDe").val();
			param.searchSe    =  $("#searchSe").val();
			param.searchText       =  $("#searchTextInput").val();
		break;
		
		//원인행위 검색시 디테일 파라미터
		case "pcaDetailListGrid":
			param.insttInfoId       =  $("#insttInfoId").val();
			param.pcsActnId         =  $("#pcsActnId").val();
		break;
		

		
	}
	
	return param;
}

//사업장이름 가져오기
function fn_getSelectedText(textVal) {
	var selectElement = document.getElementById('bplcInfoId');
	var selectedOption = selectElement.options[selectElement.selectedIndex];
	var selectedText = selectedOption.text;
	textVal.val(selectedText);
}


$(function() {
		fn_getSelectedText($('#rptRefBplcInfoInput'));		
		fn_getSelectedText($('#pcaBplcInfoInput'));		
	
   $(document).ajaxStart(function() {
      console.log("start");
   });

   $(document).ajaxStop(function() {
      console.log("stop");
   });
});


function fn_expndTxitmCnnAcntSelect(val){
	let bgtCrtrParam = {
						"insttInfoId" :$("#insttInfoId").val()
						,"bplcInfoId" :val
			};
			
			console.log(bgtCrtrParam, "벨류가몰까");
		
			$.ajax({
					url: '/acn/pca/expndTxitmCnnAcntSelect.do'
			  	 , type: 'POST'
			  	 , data: JSON.stringify(bgtCrtrParam)
			  	 , dataType: 'json'
			  	 , async: false
	 		  	 , contentType : 'application/json; charset=utf-8'
			  	 , success: function(data) {
								bgtCrtrCk =  data;
								console.log("계정 넘어오는데이터", data);
								
						
							}
						});
			bgtPjtCk();
		}



function fn_insttBgtCrtrCk(val){
	let insttBgtCrtrParam = {
						"insttInfoId" :$("#insttInfoId").val()
						,"bplcInfoId" :val
			};
			
			console.log(insttBgtCrtrParam, "벨류가몰까");
		
			$.ajax({
					url: '/acn/pca/chekedInsttBgtCrtr.do'
			  	 , type: 'POST'
			  	 , data: JSON.stringify(insttBgtCrtrParam)
			  	 , dataType: 'json'
			  	 , async: false
	 		  	 , contentType : 'application/json; charset=utf-8'
			  	 , success: function(data) {
								bgtCrtrCk =  data.bgtPjtUseYn;
								console.log("넘어오는데이터", data);
								console.log("예산체크", bgtCrtrCk);
								
						
							}
						});
			bgtPjtCk();
		fn_getSelectedText($('#rptRefBplcInfoInput'));		
		fn_getSelectedText($('#pcaBplcInfoInput'));	
			    
}

function bgtPjtCk(){
	
	
	let proBgtCrtrCk =  $("[name=proCodeCk]");
								
										
								
											  
		if(bgtCrtrCk == 'N'){ 
		console.log("예산체크2", bgtCrtrCk);
		console.log("도는중1");
		console.log(proBgtCrtrCk.length + " 프로");
		console.log(proBgtCrtrCk);
		
		for(i=0; i<proBgtCrtrCk.length; i++){
				console.log("도는중2", proBgtCrtrCk[i]);
				$(proBgtCrtrCk[i]).css('display', 'none');
				
			}
			
		}else{
				console.log("예산체크3", bgtCrtrCk);
			for(j=0; j<proBgtCrtrCk.length; j++){
				console.log("도는중3", proBgtCrtrCk[j]); 
				$(proBgtCrtrCk[j]).css('display', '');
				}
		}
									 
										
	
}


function fn_pcaSearchListGridDraw(){
	console.log("원인행위검색모달");
	$("#pcaSearchListGrid").html("");
	
	pcaSearchListGrid = new tui.Grid({
		el : document.getElementById("pcaSearchListGrid"),
		
		hideLoadingBar: false,
		scrollX : true,
		scrollY : true,
		header : {
			height : 50,
		},
		contextMenu: ({rowKey, columnName}) => (
			[
		      [
	    	    {name: 'copy', 			label: '복사', 		action: 'copy'	}
		      ]
			 ]
		),
		// rowHeaders: [{ type : "checkbox", align : 'left', renderer : { type : CheckboxRenderer} }],
		
		columns : [
					{header: '기관ID', 			name: 'insttInfoId', 		hidden: true}
				  , {header: '사업장ID', 	  		name: 'bplcInfoId', 		hidden: true}
			      , {header: '품의ID', 	      	name: 'expndRptId', 	  	hidden: true}
			      , {header: '부서번호', 	        name: 'deptCode', 	  		hidden: true}
			      , {header: '사용자정보ID', 	        name: 'userInfoId', 	  		hidden: true}
			      , {header: '비고', 	      	name: 'rmrk', 	  			hidden: true}
			      , {header: '그룹웨어문서ID', 	name: 'gwDocId', 			hidden: true} 
			      , {header: '그룹웨어수정ID', 	name: 'gwUpdtId', 		  	hidden: true} 
			      , {header: '그룹웨어수정일시', 	name: 'gwUpdtDt', 			hidden: true} 
			      , {header: '결재상태코드', 		name: 'approvalStatus', 	hidden: true}
			      , {header: '예산구분', 	        name: 'bgtSe', 	  			hidden: true}
			      , {header: '회수신청여부', 	    name: 'cancelYn', 	  		hidden: true}
				  , {header: '공개여부', 	        name: 'rlsYn', 	  			hidden: true}
			      , {header: '회수신청사유', 	    name: 'cancelRsn', 	  		hidden: true}
			      , {header: '정책사업', 	    name: 'expndPolicy', 	  		hidden: true}
			      , {header: '단위사업', 	    name: 'expndUnit', 	  		hidden: true}
			      , {header: '편성목코드', 	    name: 'expndTxitmCd', 	  		hidden: true}
			      , {header: '지출예산코드', 	    name: 'expndBgtCd', 	  		hidden: true}
			      , {header: '지출예산코드명', 	    name: 'expndBgtNm', 	  		hidden: true}
				  , {header: '원인행위일자', 	        name: 'pcsActnYmd', 	  	align: 'center', width : 80}
			      , {header: '원인행위번호', 	        name: 'pcsActnNo', 	  	align: 'center', width : 80}
			      , {header: '제목', 	        name: 'pcsActnTtl', 	  		align: 'center' , width : 150}
			      , {header: '적요', 	        name: 'sumry', 	  		align: 'center' , width : 100}
				  , {header: '부서', 			name: 'regDeptNm', 		align: 'left', width : 100}
				  , {header: '작성자', 			name: 'regNm', 		align: 'left', width : 100}
			      , {header: '계약번호', 	        name: 'ctrtId', 	  		align: 'center' , width : 100}
			      , {header: '품의번호', 	        name: 'expndRptNo', 	  		align: 'center' , width : 100}
			      , {header: '품의상세번호', 	        name: 'expndRptSeqNo', 	  		align: 'center' , width : 100 }
			      , {header: '원인행위금액', 	    name: 'pcsActnGramt', 	align: 'right', width : 130 , formatter : function(ev){
																						  					let expndRptSumAmt = nullCheck(ev.value.toString());
																											return expndRptSumAmt.replace(/\d(?=(?:\d{3})+$)/g, '$&,');
																										}
					}
			      , {header: '승인상태',         	name: 'approvalStatusNm',	align: 'center', width : 60}
			      , {header: '전자결재문서번호', 	name: 'gwDocNo', 		 	align: 'center', width : 60 , formatter : function(ev){
																											let text = "테스트";
																						  					
																											return text;
																										}}
		],
		pagination : false,
		columnOptions: { resizable: true },
    	data: {
    	  	api: {
    			readData: { url: "/acn/pca/selectPcaSearchModalList.do", method: "GET" , initParams: fn_searchParam('pcaSearchListGrid') },
    		},
	   		contentType : 'application/json',
	   		headers: {'X-CSRF-TOKEN' : TOKEN}, // ajax 요청시 꼭 필요
		}
	});
	
	
	// api 실행후 성공/실패와 관계 없이 응답을 받았을 경우
	pcaSearchListGrid.on('response', (ev) => {
		
		try{
			const {response} = ev.xhr;
	        const responseObj = JSON.parse(response);
	      
		    if( !isEmpty(responseObj.methodType) && responseObj.methodType != 'list' ) {
	        	if( responseObj.result ) {
	        		alert("데이터가 처리되었습니다.");
	        	} else {
	        		alert("데이터 처리 중 오류가 발생하였습니다. 관리자에게 문의해주십시요.");
	        	}
	        }
			pcaSearchListGrid.clearModifiedData();
		}catch(error){
			alert("데이터 처리 중 오류가 발생하였습니다. 관리자에게 문의해주십시요.");
		}
		
	});
	
	
	
	return false;
}



function fn_integrationSearchAreaDraw( se ){
	
	$("#integrationSearchArea").html("");
	
	switch( se ){
		
		case "bgtProjMngList":
			var $searchAreaSearchYear = $("<select>").attr("id", 	"searchAreaSearchYear")
									  				 .attr("class", "form-control w15");
			
			
			var $searchAreaSearchSe = $("<select>").attr("id", 	  "searchAreaSearchSe")
												   .attr("class", "form-control w15")
												   .append(
													     	 $("<option>").val("").html("-검색조건-")
														   , $("<option>").val("expndBgtCd").html("예산코드")
			);
			
			
			var $searchAreaSearchText  =  $("<input>").attr("id",    		"searchAreaSearchText")
			                                          .attr("type",  		"text")
													  .attr("class", 		"form-control w30")
													  .attr("placeholder",  "검색조건 입력");
										
										
			var $searchBtn  =  $("<a>").attr("href",    "javascript:void(0);")		
									   .attr("onclick", "fn_integrationSearchBtn('bgtProjMngList'); return false;")
									   .attr("class",   "btn btn-primary btn-m")
									   .append(
												$("<i>").attr("class", "xi-search")
												        .text("조회")
										
									   );
			
			$("#integrationSearchArea").append($searchAreaSearchYear)
									   .append($searchAreaSearchSe)
									   .append($searchAreaSearchText)
									   .append($searchBtn);
						
			var today = new Date();
			var currentYear = today.getFullYear()
			fn_addYearOpt("#searchAreaSearchYear", (currentYear - 15), (currentYear + 10), currentYear);
						
			$("#integrationModalBtn").attr("onclick", "fn_modalChoose('bgtProjMngList'); return false;");
		break;
		
		
		case "cnptList":
			$.ajax({
				url : "/cmmn/tag/selectCmmnCodeAjaxList.do",
				type : "POST",
				dataType:'json',
				async: false,
				data : {
							sysSeCodes	  :  'SEC003'
						  , insttInfoIds  :  $("#insttInfoId").val()
						  , upperCodes    :  'CPS000'
						  , upperUseYn    :  'Y'
				},
				success : function(data) {
					
					var $searchAreaSearchCnptSeCode = $("<select>").attr("id", 	"searchCnptSeCode")
																   .attr("class", "form-control w10")
														           .append(
																			$("<option>").text("전체").val("")
					);
					
					if( data != null && 0 < data.length ){
						
						$.each(data, function(i, v){
							
							$searchAreaSearchCnptSeCode.append(
																$("<option>").val(v.cmmnCode)
														       			     .text(v.cmmnCodeNm)
							);
							
						});
						
					}
					
					$("#integrationSearchArea").append($searchAreaSearchCnptSeCode);
					
				}, error : function(request,status,error) {
					alert("관리자에게 문의하세요");
				}
			});
			
			
			var $searchAreaSearchSe = $("<select>").attr("id", 	  "searchAreaSearchSe")
												   .attr("class", "form-control w15")
												   .append(
													     	 $("<option>").val("").html("-검색조건-")
														   , $("<option>").val("cnptCd").html("거래처코드")
														   , $("<option>").val("cnptNm").html("거래처명")
			);
			
			
			var $searchAreaSearchText  =  $("<input>").attr("id",    		"searchAreaSearchText")
			                                          .attr("type",  		"text")
													  .attr("class", 		"form-control w30")
													  .attr("placeholder", "검색조건 입력");
			
			
			var $searchBtn  =  $("<a>").attr("href",    "javascript:void(0);")		
									   .attr("onclick", "fn_integrationSearchBtn('cnptList'); return false;")
									   .attr("class",   "btn btn-primary btn-m")
									   .append(
												$("<i>").attr("class", "xi-search")
												        .text("조회")
										
			);
			
			$("#integrationSearchArea").append($searchAreaSearchSe)
									   .append($searchAreaSearchText)
									   .append($searchBtn);
						
			$("#integrationModalBtn").attr("onclick", "fn_modalChoose('cnptList'); return false;");
		break;
		
		
		case "expndRptList":
			var $searchAreaSearchYear = $("<select>").attr("id", 	"searchAreaSearchYear")
									  				 .attr("class", "form-control w15");
			
			
			var $searchAreaSearchSe = $("<select>").attr("id", 	  "searchAreaSearchSe")
												   .attr("class", "form-control w15")
												   .append(
													     	 $("<option>").val("").html("-검색조건-")
														   , $("<option>").val("expndRptTtl").html("제목")
														   , $("<option>").val("expndRptSeqNo").html("품의번호")
			);
			
			
			var $searchAreaSearchText  =  $("<input>").attr("id",    		"searchAreaSearchText")
			                                          .attr("type",  		"text")
													  .attr("class", 		"form-control w30")
													  .attr("placeholder",  "검색조건 입력");
										
										
										
			var $searchAreaSearchDept = $("<div>").attr("class", "w10")
										          .append(
															$("<input>").attr("type", 		 "hidden")
																	    .attr("id", 		 "deptCode2"))
												  .append(
															$("<input>").attr("type", 		 "text")
																	    .attr("id", 		 "deptNm2")
																		.attr("class",       "form-control w100")
																		.attr("disabled",    "disabled")
																		.attr("placeholder", "부서")
			);
			
			var $searchAreaSearchDeptBtn = $("<button>").attr("onclick", "fn_modalToggle('searchDeptModal2', 'open');")
												        .attr("class", "btn btn-primary btn-s w32px")
												        .append(
																 $("<i>").attr("class", "xi-search m0")
			);
			
			var $searchBtn  =  $("<a>").attr("href",    "javascript:void(0);")		
									   .attr("onclick", "fn_integrationSearchBtn('bgtProjMngList'); return false;")
									   .attr("class",   "btn btn-primary btn-m")
									   .append(
												$("<i>").attr("class", "xi-search")
												        .text("조회")
										
			);
			
			
			$("#integrationSearchArea").append($searchAreaSearchYear)
									   .append($searchAreaSearchSe)
									   .append($searchAreaSearchText)
									   .append($searchAreaSearchDept)
									   .append($searchAreaSearchDeptBtn)
									   .append($searchBtn);
			
		
			$("#integrationModalBtn").attr("onclick", "fn_modalChoose('expndRptList'); return false;");
			
			var today = new Date();
			var currentYear = today.getFullYear()
			fn_addYearOpt("#searchAreaSearchYear", (currentYear - 15), (currentYear + 10), currentYear);
		break;
		
		
		case "bankBacntList":
			var $searchAreaSearchBacntNo  =  $("<input>").attr("id",    	   "searchAreaSearchBacntNo")
			                                             .attr("type",  	   "text")
													     .attr("class", 	   "form-control w15")
													     .attr("placeholder",  "계좌번호");

			var $searchAreaSearchBacntNm  =  $("<input>").attr("id",    	   "searchAreaSearchBacntNm")
			                                             .attr("type",  	   "text")
													     .attr("class", 	   "form-control w15")
													     .attr("placeholder",  "계좌명");
											
			var $searchBtn  =  $("<a>").attr("href",    "javascript:void(0);")		
									   .attr("onclick", "fn_integrationSearchBtn('bankBacntList'); return false;")
									   .attr("class",   "btn btn-primary btn-m")
									   .append(
												$("<i>").attr("class", "xi-search")
												        .text("조회")
										
			);
			
			$("#integrationSearchArea").append($searchAreaSearchBacntNo)
									   .append($searchAreaSearchBacntNm)
									   .append($searchBtn);
			
			$("#integrationModalBtn").attr("onclick", "fn_modalChoose('bankBacntList'); return false;");
		break;
		
		
		case "cardList":
			$("#integrationModalBtn").attr("onclick", "fn_modalChoose('cardList'); return false;");
		break;
		
		
		case "pcsActnList":
			var $searchAreaSearchYear = $("<select>").attr("id", 	"searchAreaSearchYear")
									  				 .attr("class", "form-control w15");
			
			var $searchAreaSearchSe = $("<select>").attr("id", 	  "searchAreaSearchSe")
												   .attr("class", "form-control w15")
												   .append(
													     	 $("<option>").val("").html("-검색조건-")
														   , $("<option>").val("pcsActnTtl").html("제목")
														   , $("<option>").val("pcsActnNo").html("원인행위번호")
			);
			
			
			var $searchAreaSearchText  =  $("<input>").attr("id",    		"searchAreaSearchText")
			                                          .attr("type",  		"text")
													  .attr("class", 		"form-control w30")
													  .attr("placeholder",  "검색조건 입력");
										
										
										
			var $searchAreaSearchDept = $("<div>").attr("class", "w10")
										          .append(
															$("<input>").attr("type", 		 "hidden")
																	    .attr("id", 		 "deptCode3"))
												  .append(
															$("<input>").attr("type", 		 "text")
																	    .attr("id", 		 "deptNm3")
																		.attr("class",       "form-control w100")
																		.attr("disabled",    "disabled")
																		.attr("placeholder", "부서")
			);
			
			var $searchAreaSearchDeptBtn = $("<button>").attr("onclick", "fn_modalToggle('searchDeptModal3', 'open');")
												        .attr("class", "btn btn-primary btn-s w32px")
												        .append(
																 $("<i>").attr("class", "xi-search m0")
			);
			
			var $searchBtn  =  $("<a>").attr("href",    "javascript:void(0);")		
									   .attr("onclick", "fn_integrationSearchBtn('pcsActnList'); return false;")
									   .attr("class",   "btn btn-primary btn-m")
									   .append(
												$("<i>").attr("class", "xi-search")
												        .text("조회")
										
			);
			
			$("#integrationSearchArea").append($searchAreaSearchYear)
									   .append($searchAreaSearchSe)
									   .append($searchAreaSearchText)
									   .append($searchAreaSearchDept)
									   .append($searchAreaSearchDeptBtn)
									   .append($searchBtn);
			
			$("#integrationModalBtn").attr("onclick", "fn_modalChoose('pcsActnList'); return false;");
			
			var today = new Date();
			var currentYear = today.getFullYear()
			fn_addYearOpt("#searchAreaSearchYear", (currentYear - 15), (currentYear + 10), currentYear);
		break;
		
	}	
	
	return false;
}

	



function fn_expRptReferenceGridDraw(){
	console.log("품의서참조모달");
	$("#expRptReferenceGrid").html("");
	
	expRptReferenceGrid = new tui.Grid({
		el : document.getElementById("expRptReferenceGrid"),
		
		hideLoadingBar: false,
		bodyHeight: gbHeight,
		//editingEvent : 'click',
		scrollX : true,
		scrollY : true,
		header : {
			height : 50,
		},
		contextMenu: ({rowKey, columnName}) => (
			[
		      [
	    	    {name: 'copy', 			label: '복사', 		action: 'copy'	}
		      ]
			 ]
		),
		// rowHeaders: [{ type : "checkbox", align : 'left', renderer : { type : CheckboxRenderer} }],
		
		columns : [
					{header: '기관ID', 			name: 'insttInfoId', 		hidden: true}
				  , {header: '사업장ID', 	  		name: 'bplcInfoId', 		hidden: true}
			      , {header: '품의ID', 	      	name: 'expndRptId', 	  	hidden: true}
			      , {header: '부서번호', 	        name: 'deptCode', 	  		hidden: true}
			      , {header: '비고', 	      	name: 'rmrk', 	  			hidden: true}
			      , {header: '그룹웨어문서ID', 	name: 'gwDocId', 			hidden: true} 
			      , {header: '그룹웨어수정ID', 	name: 'gwUpdtId', 		  	hidden: true} 
			      , {header: '그룹웨어수정일시', 	name: 'gwUpdtDt', 			hidden: true} 
			      , {header: '결재상태코드', 		name: 'approvalStatus', 	hidden: true}
			      , {header: '예산구분', 	        name: 'bgtSe', 	  			hidden: true}
			      , {header: '회수신청여부', 	    name: 'cancelYn', 	  		hidden: true}
				  , {header: '공개여부', 	        name: 'rlsYn', 	  			hidden: true}
			      , {header: '회수신청사유', 	    name: 'cancelRsn', 	  		hidden: true}
			      , {header: '정책사업', 	    name: 'expndPolicy', 	  		hidden: true}
			      , {header: '단위사업', 	    name: 'expndUnit', 	  		hidden: true}
			      , {header: '편성목코드', 	    name: 'expndTxitmCd', 	  		hidden: true}
			      , {header: '지출예산코드', 	    name: 'expndBgtCd', 	  		hidden: true}
			      , {header: '지출예산코드명', 	    name: 'expndBgtNm', 	  		hidden: true}
				  , {header: '품의일자', 	        name: 'expndRptYmd', 	  	align: 'center', width : 80}
			      , {header: '품의번호', 	        name: 'expndRptNo', 	  	align: 'center', width : 80}
			      , {header: '상세번호', 	        name: 'expndRptSeqNo', 	  	align: 'center', width : 20}
				  , {header: '제목', 			name: 'expndRptTtl', 		align: 'left', width : 250}
			      , {header: '품의부서', 	        name: 'deptNm', 	  		align: 'center' , width : 150}
			      , {header: '세부사업', 	        name: 'expndDetailed', 	  		align: 'center' , width : 100}
			      , {header: '편성목명', 	        name: 'expndTxitmNm', 	  		align: 'center' , width : 100}
			      , {header: '품의금액', 	    name: 'expndRptAmt', 	align: 'right', width : 130 , formatter : function(ev){
																						  					let expndRptSumAmt = nullCheck(ev.value.toString());
																											return expndRptSumAmt.replace(/\d(?=(?:\d{3})+$)/g, '$&,');
																										}
					}
				  , {header: '지출금액', 	    name: 'expndAmt', 	align: 'right', width : 130 , formatter : function(ev){
																						  					let expndAmt = nullCheck(ev.value.toString());
																											return expndAmt.replace(/\d(?=(?:\d{3})+$)/g, '$&,');
																										} 
					}
				  , {header: '잔액', 	    name: 'expndBlnc', 	align: 'right', width : 130 , formatter : function(ev){
																											let expndBlnc = "";
																											
																						  					let expndRptAmtBlnc = ev.row.expndRptAmt;
																						  					let expndAmtBlnc = ev.row.expndAmt;
																											expndBlnc = nullCheck((expndRptAmtBlnc - expndAmtBlnc).toString());
																											return expndBlnc.replace(/\d(?=(?:\d{3})+$)/g, '$&,');
																										}
					}
			      , {header: '승인상태',         	name: 'approvalStatusNm',	align: 'center', width : 60}
			      , {header: '전자결재문서번호', 	name: 'gwDocNo', 		 	align: 'center', width : 60 , formatter : function(ev){
																											let text = "테스트";
																						  					
																											return text;
																										}}
		],
		pagination : false,
		columnOptions: { resizable: true },
    	data: {
    	  	api: {
    			readData: { url: "/acn/pca/selectRptReferenceModal.do", method: "GET", initParams: fn_searchParam('rptReferenceSearchGrid')},
    		},
	   		contentType : 'application/json',
	   		headers: {'X-CSRF-TOKEN' : TOKEN}, // ajax 요청시 꼭 필요
		}
	});
	
	
	// api 실행후 성공/실패와 관계 없이 응답을 받았을 경우
	expRptReferenceGrid.on('response', (ev) => {
		
		try{
			const {response} = ev.xhr;
	        const responseObj = JSON.parse(response);
	      
		    if( !isEmpty(responseObj.methodType) && responseObj.methodType != 'list' ) {
	        	if( responseObj.result ) {
	        		alert("데이터가 처리되었습니다.");
	        	} else {
	        		alert("데이터 처리 중 오류가 발생하였습니다. 관리자에게 문의해주십시요.");
	        	}
	        }
			expRptReferenceGrid.clearModifiedData();
		}catch(error){
			alert("데이터 처리 중 오류가 발생하였습니다. 관리자에게 문의해주십시요.");
		}
		
	});
	
	
	
	return false;
}

/* 거래처 참조 모달 생성 */
function fn_cnptListGridDraw(){
	
	$("#integrationGrid").html("");
	$("#integrationModalTitle").html("거래처 참조");
	$("#integrationModalSubTitle").html("거래처리스트");
	
	integrationGrid = new tui.Grid({
		el : document.getElementById("integrationGrid"),
		bodyHeight: gbHeight,
		hideLoadingBar: false,
		//editingEvent : 'click',
		scrollX : false,
		scrollY : true,
		header : {
			height : 50,
		},
		contextMenu: ({rowKey, columnName}) => (
			[
		      [
	    	    {name: 'copy', 			label: '복사', 		action: 'copy'	}
		      ]
			 ]
		),
		// rowHeaders: [{ type : "checkbox", align : 'left', renderer : { type : CheckboxRenderer} }],
		rowHeaders: ['checkbox'],
		columns : [
					{header: '기관ID', 			  		name: 'insttInfoId', 			hidden: true}
				  , {header: '거래처ID(시퀀스)', 	  		name: 'cnptId', 				hidden: true}
			      , {header: '거래처구분코드', 	      		name: 'cnptSeCode', 	  		hidden: true}
			      , {header: '은행코드', 	          		name: 'cnptBankCd', 	  		hidden: true}
				  , {header: '홈페이지', 	          		name: 'hmpg', 	  				hidden: true}
			      , {header: '사용여부', 	          		name: 'useYn', 	  				hidden: true}
			      , {header: '팩스번호', 	          		name: 'faxNo', 	  				hidden: true}
				  , {header: '거래처코드', 				name: 'cnptCd', 				align: 'center'}
			      , {header: '거래처구분', 	      		name: 'cnptSeCodeNm', 	  		align: 'center'}
			      , {header: '상호', 	          		name: 'cnptNm', 		 		align: 'center'}
			      , {header: '대표자', 	          		name: 'rprchsRprsvNm', 			align: 'center'} 
			      , {header: '업태', 	         		name: 'bzstat', 		  		align: 'center'} 
			      , {header: '업종', 	          		name: 'tobiz', 					align: 'center'} 
			      , {header: '사업자번호', 				name: 'cnptIdnftBrno', 	  	    align: 'center'}
			      , {header: '전화번호',         	  		name: 'telno',				    align: 'center'}
			      , {header: '주소', 	          		name: 'addr', 	  				align: 'center'}
			      , {header: '담당자', 	          		name: 'picNm', 	  			    align: 'center'}
				  , {header: '거래은행', 	          		name: 'bankCdNm', 	  			align: 'center'}
			      , {header: '송금계좌번호', 	       		name: 'cnptBacntNo', 	  		align: 'center'}
			      , {header: '예금주', 	          		name: 'dpstrNm', 	  			align: 'center'}
			      , {header: '이메일', 	         		name: 'email', 	  				align: 'center'}
		],
		pagination : false,
		columnOptions: { resizable: true },
    	data: {
    	  	api: {
    			readData: { url: "/acn/asm/acntgCnptManageList.do", method: "GET", initParams: fn_searchParam('cnptList')},
    		},
	   		contentType : 'application/json',
	   		headers: {'X-CSRF-TOKEN' : TOKEN}, // ajax 요청시 꼭 필요
		}
	});
	
	
	// api 실행후 성공/실패와 관계 없이 응답을 받았을 경우
	integrationGrid.on('response', (ev) => {
	
		try{
			const {response} = ev.xhr;
	        const responseObj = JSON.parse(response);
	      
		    if( !isEmpty(responseObj.methodType) && responseObj.methodType != 'list' ) {
	        	if( responseObj.result ) {
	        		alert("데이터가 처리되었습니다.");
	        	} else {
	        		alert("데이터 처리 중 오류가 발생하였습니다. 관리자에게 문의해주십시요.");
	        	}
	        }
			integrationGrid.clearModifiedData();
		}catch(error){
			alert("데이터 처리 중 오류가 발생하였습니다. 관리자에게 문의해주십시요.");
		}
		
	});
	
	fn_modalToggle('integrationModal', 'open');
	
	return false;
}






function fn_integrationGridDraw( se ){
	
	$("#integrationGrid").html("");
	$("#detailSelectedRowKey").val("");
	
	switch( se ){
		


		case "cnptList":			// 거래처참조
			fn_integrationSearchAreaDraw('cnptList');	
			fn_cnptListGridDraw();
		break;
		

		
		case "cardList":			// 카드번호 조회
			fn_integrationSearchAreaDraw('cardList');
			fn_cardListGridDraw();
		break;
		
		
		
	}
	
	return false;	
}


// 카드번호 그리드 생성
function fn_cardListGridDraw(){
	
	$("#integrationGrid").html("");
	$("#integrationModalTitle").html("카드번호");
	$("#integrationModalSubTitle").html("카드리스트");
	
	integrationGrid = new tui.Grid({
		el : document.getElementById("integrationGrid"),
		bodyHeight: gbHeight,
		hideLoadingBar: false,
		//editingEvent : 'click',
		scrollX : false,
		scrollY : true,
		header : {
			height : 50,
		},
		contextMenu: ({rowKey, columnName}) => (
			[
		      [
	    	    {name: 'copy', 			label: '복사', 		action: 'copy'	}
		      ]
			 ]
		),
		// rowHeaders: [{ type : "checkbox", align : 'left', renderer : { type : CheckboxRenderer} }],
		rowHeaders: ['checkbox'],
		columns : [
				    {header: '카드번호', 	  		name: 'cardNo', 			align: 'center'}
				  , {header: '카드명', 			name: 'cardNm', 			align: 'center'}
		],
		pagination : false,
		columnOptions: { resizable: true },
    	data: {
    	  	api: {
    			readData: { url: "/acn/asm/selectCorpCardManageList.do", method: "GET"},
    		},
	   		contentType : 'application/json',
	   		headers: {'X-CSRF-TOKEN' : TOKEN}, // ajax 요청시 꼭 필요
		}
	});
	
	
	// api 실행후 성공/실패와 관계 없이 응답을 받았을 경우
	integrationGrid.on('response', (ev) => {
	
		try{
			const {response} = ev.xhr;
	        const responseObj = JSON.parse(response);
	      
		    if( !isEmpty(responseObj.methodType) && responseObj.methodType != 'list' ) {
	        	if( responseObj.result ) {
	        		alert("데이터가 처리되었습니다.");
	        	} else {
	        		alert("데이터 처리 중 오류가 발생하였습니다. 관리자에게 문의해주십시요.");
	        	}
	        }
			integrationGrid.clearModifiedData();
		}catch(error){
			alert("데이터 처리 중 오류가 발생하였습니다. 관리자에게 문의해주십시요.");
		}
		
	});
	
	fn_modalToggle('integrationModal', 'open');
	
	return false;
}



function fn_pcaDetailGridDraw(){
	console.log("행위내역 그리드");
	$("#pcaDetailGrid").html("");
	
	
	
	
/*	class CustomAmtEditor {
		
		constructor(props){
			const el = document.createElement('input');
        	el.type = 'Number';
        	el.value = Number(props.value ? props.value: "");
			el.readonly = true;
        	this.el = el;
      	}

      	getElement() {
	        return this.el;
      	}

      	getValue() {
	        return this.el.value.replace(/\d(?=(?:\d{3})+$)/g, '$&,');
      	}

      	mounted() {
	        this.el.select();
      	}
    }*/


		class AcntgCnptSearch {
							
		constructor(prop) {
			
			const el = document.createElement('button');
			// 버튼의 타입 설정
			el.setAttribute("type", "button");
			// let key = prop.rowKey;
			// let incmBgtDmndDrftAt = nullCheck(incmListGrid.getValue(key, "incmBgtDmndDrftAt"));
			
			el.className = "btn btn-primary btn-m";			
			el.innerHTML = '<i class="xi-search"></i>';
			
			el.addEventListener('click', function (ev) {
				fn_integrationGridDraw('cnptList');
				let rowKey = prop.rowKey; 
				$("#detailSelectedRowKey").val(rowKey);
			});
			
			this.el = el;
		}
		getElement() {
			return this.el;
		}
		
	}
	
	
	class CardListSearch {
							
		constructor(prop) {
			
			const el = document.createElement('button');
			// 버튼의 타입 설정
			el.setAttribute("type", "button");
			el.className = "btn btn-primary btn-m";			
			el.innerHTML = '<i class="xi-search"></i>';
			
			el.addEventListener('click', function (ev) {
				fn_integrationGridDraw('cardList');
				let rowKey = prop.rowKey; 
				$("#detailSelectedRowKey").val(rowKey);
			});
			
			this.el = el;
		}
		getElement() {
			return this.el;
		}
		
	}

	
	 $("#pcaDetailGrid").html("");
	
	//원인행위상세
	pcaDetailGrid = new tui.Grid({
		el : document.getElementById("pcaDetailGrid"),
		
		hideLoadingBar: false,
		editingEvent : 'click',
		scrollX : true,
		scrollY : true,
		bodyHeight: gbHeight ,
		header : {
			height : 50,
		},
		contextMenu: ({rowKey, columnName}) => (
			[
		      [
	    	    {name: 'copy', 			label: '복사', 		action: 'copy'	}
		      ]
			 ]
		),
		rowHeaders: ['checkbox'],
		
		columns : [
					{header: '원인행위ID', 			name: 'pcsActnId', 		hidden: true}
				  , {header: '원인행위상세번호', 	  		name: 'pcsActnDsctnSeqNo', 		hidden: true}
  				  , {header: '계정과목',				name: 'acntlCode',    align: 'center',	formatter: fn_selectFormatter	
																							  , validation: {required: true}	
																							  , editor: { 
			   																								type: 'select' 
			 																							  , options: { listItems: fn_acntlCodeList() } 
    																							}
					}
			      , {header: '회수신청사유', 	    name: 'cancelRsn', 	  		hidden: true}
			      , {header: '정책사업', 	    name: 'expndPolicy', 	  		hidden: true}
			      , {header: '단위사업', 	    name: 'expndUnit', 	  		hidden: true}
			      , {header: '지급처(거래처id)', 	    name: 'cnptId', 	  		hidden: true}

				  , {header: '품명', 	        name: 'prdctNm', 	  	align: 'center',  						  
					editor : { type: CustomTextEditor, options: {  maxLength: 50 }
							}}
			      , {header: '수량', 	        name: 'qy', 	  	align: 'center', width : 80,
					editor : { type: CustomTextEditor, options: {  maxLength: 15 }
							}}
			      , {header: '단위', 	        name: 'unit', 	  	align: 'center', width : 80,
					editor : { type: CustomTextEditor, options: {  maxLength: 20 }
							}}
				  , {header: '단가', 			name: 'unpr', 		align: 'left', width : 80,
					editor : { type: CustomTextEditor, options: {  maxLength:  15}
							}, /*formatter : function(ev){
									let expndBlnc = "";
									
				  					let expndRptAmtBlnc = ev.row.expndRptAmt;
				  					let expndAmtBlnc = ev.row.expndAmt;
									expndBlnc = nullCheck((expndRptAmtBlnc - expndAmtBlnc).toString());
									return expndBlnc.replace(/\d(?=(?:\d{3})+$)/g, '$&,');
																										}*/
					}
			      , {header: '규격', 	        name: 'standard', 	  	align: 'center', width : 100,
					editor : { type: CustomTextEditor, options: {  maxLength: 50 }
							}}
			      , {header: '지급처', 	        name: 'cnptNm', 	  		align: 'center' , 
					editor : { type: CustomTextEditor, options: {  maxLength: 50 }
							}}
				  , {header: '지급처ID', 	    name: 'cnptId', hidden: true}
			      , {header: ' ', 	        name: 'cnptBtn', 	  		align: 'center', renderer :{ type: AcntgCnptSearch}, width: 30  }
			      , {header: '수령인명', 	        name: 'recptrNm', 	  		align: 'center' ,
					editor : { type: CustomTextEditor, options: {  maxLength: 50 }
							}}
			      , {header: '은행코드', 	        name: 'bankCd', 	  		align: 'center' ,
					editor : { type: CustomTextEditor, options: {  maxLength: 50 }
							}}
			      , {header: '계좌번호', 	        name: 'bacntNo', 	  		align: 'center' ,
					editor : { type: CustomTextEditor, options: {  maxLength: 50 }
							}}
			      , {header: '카드번호', 	        name: 'cardNo', 	  		align: 'center' ,
					editor : { type: CustomTextEditor, options: {  maxLength: 50 }
							}}
				  , {header: ' ', 	        name: 'cardListSearch', 	  		align: 'center' , renderer :{ type: CardListSearch}, width: 30  }
			      , {header: '행위금액', 	    name: 'pcsActnAmt',
					editor : { type: CustomTextEditor, options: {  maxLength: 50 }
							}, align: 'right' , formatter : function(ev){ let pcsAcntnAmtVal = ev.value.toString();
																			// 정규식으로 숫자나 문자 이외의 글자를 모두 제거
																				let formatData = pcsAcntnAmtVal.replace(/[^0-9]/g, '');
																						  					let pcsActnAmt = nullCheck(formatData);
																											return pcsActnAmt.replace(/\d(?=(?:\d{3})+$)/g, '$&,');
																										}
					}
			      , {header: '부가세', 	    name: 'vat', 	align: 'right' ,
					editor : { type: CustomTextEditor, options: {  maxLength: 50 }
							}, formatter : function(ev){
																						  					let vat = nullCheck(ev.value.toString());
																											return vat.replace(/\d(?=(?:\d{3})+$)/g, '$&,');
																										}
					}
				  , {header: '행위총액', 	    name: 'pcsActnAmtAll', 	align: 'right',  formatter : function(ev){
																											let pcsActnBlnc = 0;
																						  					let pcsActnAmt = ev.row.pcsActnAmt;
																						  					let vat = ev.row.vat;
																											let plus = ((Number)(vat)+(Number)(pcsActnAmt))
																											pcsActnBlnc = nullCheck((plus).toString());
																											ev.row.pcsActnAmtAll = plus;
																											
																											return pcsActnBlnc.replace(/\d(?=(?:\d{3})+$)/g, '$&,');
																										}
					}		     
		],
		pagination : false,
		columnOptions: { resizable: true },
    	data: {
    	  	api: {
    			readData: { url: "/acn/pca/selectPcaDetailList.do", method: "GET" , initParams: fn_searchParam('pcaDetailListGrid') },
    			deleteData: { url: "/acn/pca/deletePcsActnManageDetail.do", method: "POST"}
    		},
	   		contentType : 'application/json',
	   		headers: {'X-CSRF-TOKEN' : TOKEN}, // ajax 요청시 꼭 필요
		},

	  onGridUpdated() {

				
				let unprSet =	pcaDetailGrid.getColumnValues('unpr');
		   		let pcsActnAmtSet =	pcaDetailGrid.getColumnValues('pcsActnAmt');
		   		let vatSet =	pcaDetailGrid.getColumnValues('vat');
				
				if(unprVal == 0 ){
				for(let set1 in unprSet){
					unprVal += unprSet[set1]
				};	
				}
				
				if(pcsActnAmtVal == 0 ){
				for(let set2 in pcsActnAmtSet){
					pcsActnAmtVal += pcsActnAmtSet[set2]
				};	
				}
				
				if(vatVal == 0 ){
				for(let set3 in vatSet){
					vatVal += vatSet[set3]
				};	
				}
				
				console.log("unprVal 값", unprVal);
				console.log("pcsActnAmtVal 값", pcsActnAmtVal);
				console.log("vatVal 값", vatVal);
				
				
			//그리드를 그린후 사용
			document.getElementById("pcsActnAmtInput").value = pcsActnAmtVal.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
			document.getElementById("vatInput").value = vatVal.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
			document.getElementById("pcsAmtAll").value = (pcsActnAmtVal+vatVal).toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
			document.getElementById("expJanAmt").value = (Number(document.getElementById("expndBlncInput").value.replace(/,/gi,'')) - (pcsActnAmtVal+vatVal)).toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
	  }
	});
	
	
	// api 실행후 성공/실패와 관계 없이 응답을 받았을 경우
	pcaDetailGrid.on('response', (ev) => {
		
		try{
			const {response} = ev.xhr;
	        const responseObj = JSON.parse(response);
	      
		    if( !isEmpty(responseObj.methodType) && responseObj.methodType != 'list' ) {
	        	if( responseObj.result ) {
	        		alert("데이터가 처리되었습니다.");
	        	} else {
	        		alert("데이터 처리 중 오류가 발생하였습니다. 관리자에게 문의해주십시요.");
	        	}
	        }
			pcaDetailGrid.clearModifiedData();
		}catch(error){
			alert("데이터 처리 중 오류가 발생하였습니다. 관리자에게 문의해주십시요.");
		}

	});
	

	
	return false;
}



let selectedRowKey = null; // 선택된 row의 key를 저장하는 변수

function fn_selectFormatter(obj){
	let text = "";
	let value = obj.value;
	let columnName = obj.column.name;
	switch( columnName ){
		case "acntlCode":
			for( let i = 0; i < acntlCodeList.length; i++ ) {
				if( value == acntlCodeList[i].value ){
		      		text = acntlCodeList[i].text;

		    	}
		  	}
		break;
		
	}	
  	return text;
}

function fn_acntlCodeList(){
	
	let selectedYear = $("#pcaYmd").val().substr(0, 4);
		
	var param = {
					"bgtYear"       :  selectedYear
				 ,  "expndTxitmCd"  :  $("#expndTxitmCdInput").val()
	};
	acntlCodeList = [];	
	$.ajax({
		url: '/acn/ddm/selectAcntlCodeList.do'
	  , type: 'POST'
	  ,	data: JSON.stringify(param)
	  ,	dataType: 'json'
	  ,	async: false
	  , contentType : 'application/json; charset=utf-8'
	  , success: function(data) {
		
			let result = data.result;
			
			if( result != null && 0 < result.length ){
				
				$.each(result, function(i, v){
					
					var obj = {
									text  : v.acntlNm
								  , value : v.acntlCode
					};
					
					acntlCodeList.push(obj);
				});
				
			}
	  }
	  , error:function (request, status, error){
			alert("관리자에게 문의하세요. code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
	  }
		
	});
	
	
	return acntlCodeList;
}

//버튼
function fn_pacBtnCntrl( se ){
	/* 필수값 작성 확인 Start */
	let esntlVlChck = true;
	let insttInfoId     =  $("#insttInfoId").val();
	let pcsActnId      =  $("#pcsActnId").val();
	let pcsActnYmd     =  $("#pcaYmd").val();
	let bplcInfoId      =  $("#bplcInfoId").val();
	let deptCode      =  $("#deptCode").val();
	let userInfoId      =  $("#userInfoId").val();
	let expndRsltnType      =  $("#expndRsltnTypeInput").val();
	let pcsActnNo      =  $("#pcsActnNo").val();
	let ctrtId      =  $("#ctrtId").val();
	let expndRptId      =  $("#expndRptId").val();
	let expndRptSeqNo      =  $("#rptSeqNoInput").val();
	let rlsYn  	    	=  $("input[name='rlsYn']:checked").val();
	let deptNm  	    =  $("#deptNm").val();
	let pcsActnTtl     =  $("#pcaTtlInput").val();
	let sumry  		    =  $("#sumryTextarea").val();
	let pcsActnGramt  =  Number($("#pcsAmtAll").val().replaceAll(",", ""));
	let approvalStatus = $("#approvalStatus").val();
			
	switch( se ){
		
		
		
		
		
		case "new":
			fn_resetField('regist');
			$("#inptStts").val("신규등록");
			fn_pcaDetailGridDraw();
			fn_editingFinish();

		break;
		
		case "empSearchModal":
			fn_modalToggle(id, "open");
		break;


		case "deptSearchModal":
			fn_modalToggle(id, "open");
		break;
		
		
		
		//지출품의 참조 모달
		case "expRptReferenceOpen":
		    fn_rangeDate('searchRptReferenceModal');	
			fn_expRptReferenceGridDraw();
			fn_pcaClickCntrl('expRptReferenceGridClick1');
			fn_pcaClickCntrl('expRptReferenceGridClick2');

			fn_modalToggle('rptReferenceModal', 'open');
		break;
		
		
		//원인행위 검색 모달
		case "pcaDocSearchOpen":
		    fn_rangeDate('pcaSearchModal');	
			fn_pcaSearchListGridDraw();
			fn_pcaClickCntrl('pcaSearchListGridClick1')
			fn_pcaClickCntrl('pcaSearchListGridClick2')

			fn_modalToggle('pcaSearchModal', 'open');
		break;
		
		
		case "see" :
			fnElcApprovalSubmit();
		break;
		
		
		case "delete":
			
			
			
			if("" == expndRptId){
				alert("품의서를 선택해주시기 바랍니다.");
				return false;
			}
			
			if( approvalStatus != 'APS001' ){
				alert("전자결재 진행중이거나 결재완료된 문서는 수정이 불가능합니다.");
				return false;
			}
			
			if( confirm("상세 항목도 모두 삭제됩니다. 삭제하시겠습니까?") ){
				
				let param = {
								"insttInfoId"  :  insttInfoId
							 ,  "pcsActnId"   :  pcsActnId
						     ,  "pcsActnYmd"  :  pcsActnYmd
				};
				
				
				$.ajax({
						url: '/acn/pca/deletePcsActnManageMaster.do'
					  , type: 'POST'
					  ,	data: JSON.stringify(param)
					  ,	dataType: 'json'
					  ,	async: false
			 		  , contentType : 'application/json; charset=utf-8'
					  , success: function(data) {
					
							if( data.success ){
								alert("작업에 성공하였습니다.");
								fn_resetField('regist');
								$("#expRptDetailGrid").html("");
								$("#expBgtCodeListGrid").html("");
							}else{
								alert("작업에 실패하였습니다. 관리자에게 문의바랍니다.");
								return false;
							}
					
					  }
					  , error:function (request, status, error){
							alert("관리자에게 문의하세요. code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					  }
					
					});
				
				return false;
			}
			
			
		break;


		case "save":
			
			if(!expndRptId){
				alert("품의서를 선택해주시기 바랍니다.");
				$("#expndRptId").focus();
				return false;
			}
			
			let param = {
							"insttInfoId"  :  $("#insttInfoId").val()
					     ,  "pcsActnId"   :  $("#pcsActnId").val()
			};
			
			
			
			
			

			
			
			if( !pcsActnYmd ){
				alert("원인행위일자를 선택해주시기 바랍니다.");
				$("#expndRptYmd").focus();
				return false;
			}
			else if( !bplcInfoId ){
				alert("사업장을 선택해주시기 바랍니다.");
				$("#bplcInfoId").focus();
				return false;
			}
			else if( !deptCode ){
				alert("품의부서를 선택해주시기 바랍니다.");
				$("#deptCode").focus();
				return false;
			}
			if( !userInfoId ){
				alert("작성자를 선택해주시기 바랍니다.");
				$("#userInfoNm").focus();
				return false;
			}
			else if( !pcsActnTtl.trim() ){
				alert("제목을 입력해주시기 바랍니다.");
				$("#expndRptTtl").focus();
				return false;
			}
			else if( !sumry.trim() ){
				alert("적요를 입력해주시기 바랍니다.");
				$("#sumry").focus();
				return false;
			}
			else if( !pcsActnGramt ){
				alert("행위금액과 부가세를 작성해주세요.");
				return false;
			}
			
			const jsonData = pcaDetailGrid.getModifiedRows();
			console.log(jsonData,"제이슨데이터");
			const createdRows = jsonData.createdRows;
			console.log(createdRows,"크리에이트데이터");
			createdRows.forEach(function(row){
				
				if(  !row.prdctNm ||  !row.pcsActnAmt || !row.pcsActnAmtAll ){
					alert("원인행위의 필수값을 작성해주시기 바랍니다.");
					esntlVlChck = false;
				}
				
			});

			const updatedRows = jsonData.updatedRows;
			updatedRows.forEach(function(row){
				
				if( !row.prdctNm ||  !row.pcsActnAmt || !row.pcsActnAmtAll ){
					alert("원인행위의 필수값을 작성해주시기 바랍니다.");
					esntlVlChck = false;
				}
				
			});
			/* 필수값 작성 확인 End */
			var expJanAmt = Number($("#expJanAmt").val().replace(/,/gi,''));

			if(expJanAmt < 0) {
				alert("등록하려는 원인행위 금액이 현재 품의가능한 금액보다 큽니다. 금액을 조정해주세요.");
				return;
			}			
			
			
			if( esntlVlChck ){
				
				/* 원인행위의 결재상태 확인 */
								
					var pcsActnData = {
										 	"insttInfoId"     :  insttInfoId
										 ,  "pcsActnId"       :  pcsActnId
										 ,  "pcsActnYmd"      :  pcsActnYmd
										 ,  "bplcInfoId"      :  bplcInfoId
										 ,  "ctrtId"      	  :  ctrtId
										 ,  "expndRptId"      :  expndRptId
										 ,  "expndRptSeqNo"   :  expndRptSeqNo
										 ,  "expndRsltnType"  :  expndRsltnType
										 ,  "rlsYn"      	  :  rlsYn
										 ,  "userInfoId"      :  userInfoId
										 ,  "deptCode"        :  deptCode
										 ,  "deptNm"          :  deptNm
										 ,  "pcsActnTtl"      :  pcsActnTtl
									     ,  "sumry"           :  sumry
								         ,  "pcsActnGramt"    :  pcsActnGramt
										 ,  "pcsJsonData"		  :  jsonData
					};
					
			
				
				if( confirm("저장하시겠습니까?") ){
					
					
					
					$.ajax({
						url: '/acn/pca/modifyPcsActnManage.do'
					  , type: 'POST'
					  ,	data: JSON.stringify(pcsActnData)
					  ,	dataType: 'json'
					  ,	async: false
			 		  , contentType : 'application/json; charset=utf-8'
					  , success: function(data) {
					
							if( data.success ){
								alert("작업에 성공하였습니다.");
								fn_resetField('regist');
								$("#pcaDetailGrid").html("");
							}else{
								alert("작업에 실패하였습니다. 관리자에게 문의바랍니다.");
								return false;
							}
					
					  }
					  , error:function (request, status, error){
							alert("관리자에게 문의하세요. code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					  }
					
					});
				
				}
			}
			
			
		break;
		

		
		
		
		
	}
	


	
	return false;
}



function fn_pcaClickCntrl(se){


	switch( se ){
		case "expRptReferenceGridClick1":
			// 품의서참조 셀 더블클릭 이벤트
			expRptReferenceGrid.on('click', (evClick1)=>{
				console.log("클릭이벤트 실행중");

				$("#rptRefSelectBtn").on('click', function(){
					fn_modalChoose( 'rptReferenceModal' , evClick1);
				});
				
				evClick.stop();
				
			});
		break;
		
		case "expRptReferenceGridClick2":
			// 품의서참조 셀 더블클릭 이벤트
			expRptReferenceGrid.on('dblclick', (evClick2)=>{
				fn_modalChoose( 'rptReferenceModal' , evClick2);
				evClick.stop();
				
			});
		break;
		
		
		case "pcaSearchListGridClick1":
		// 원인행위 셀 더블클릭 이벤트
			pcaSearchListGrid.on('click', (evClick3)=>{
				
				$("#pcaSearchSelectBtn").on('click', function(){
					fn_modalChoose( 'pcaSearchListGrid' , evClick3);
				});
				evClick.stop();
			});
		break;
		
		case "pcaSearchListGridClick2":
		// 원인행위 셀 더블클릭 이벤트
			pcaSearchListGrid.on('dblclick', (evClick4)=>{
				fn_modalChoose( 'pcaSearchListGrid' , evClick4);
				evClick.stop();
			});
		break;
		
	}
	
	return false;



}


function fn_resetField( se ){
	
	switch( se ){
		
		case "regist":
			$("#pcsActnNo").val("");
			$("#pcsActnNoSearch").val("");
			$("#expndRptId").val("");

			$("#rptNoInput").val("");
			$("#rptSeqNoInput").val("");
			$("#rptTtlInput").val("");
			$("#rptDeptInput").val("");
			$("#rptYmdInput").val("");
			$("#ctrtNoInput").val("");
			$("#ctrtTtlInput").val("");
			$("#bplcInfoInput").val("").prop("selected", true);
			$("#radio1").val("Y").prop("selected", true);
			$("#deptCode").val("");
			$("#deptNm").val("");
			$("#userInfoId").val("");
			$("#expRptBplcInfoNmInput").val("");
			$("#userInfoNm").val("");
			
			$("#docSttsInput").val("");
			$("#docNoInput").val("");
			$("#pcaTtlInput").val("");
			$("#sumryTextarea").val("");
			
			$("#expndBgtCdInput").val("");
			$("#expndPolicyInput").val("");
			$("#expndUnitInput").val("");
			$("#expndDetailedInput").val("");
			$("#bsnsCdInput").val("");
			$("#bsnsNmInput").val("");
			$("#expndTxitmCdInput").val("");
			$("#expndTxitmNmInput").val("");
			$("#expndRptAmtInput").val("");
			$("#pcsActnUsedGramtInput").val("");
			
			$("#expndBlncInput").val("");
			$("#pcsActnAmtInput").val("");
			$("#vatInput").val("");
			$("#pcsAmtAll").val("");
			$("#expjanAmt").val("");
			$("#expJanAmt").val("");
			
			$("#sector").val("");
			$("#key1").val("");
			$("#key2").val("");
			$("#approvalStatusElc").val("");
			
		break;
		
		
		case "dept":
			$("#deptCode").val("");
			$("#deptNm").val("");
		break;
		
		
		case "userInfo":
			$("#userInfoId").val("");	
			$("#userInfoNm").val("");
		break;
		
		
		case "search":
			$("#rangeDate").val("3m").prop("selected", true);
			fn_rangeDate('searchRptReferenceModal');
			$("#searchDeptCode").val("");
			$("#searchDeptNm").val("");
			$("#searchExpndRptNo2").val("");
			$("#searchExpndRptTtl2").val("");
		break;
		
		
		case "get":
			$("#rangeDate3").val("3m").prop("selected", true);
			fn_rangeDate('expRptCloneModal');
			$("#searchDeptCode3").val("");
			$("#searchDeptNm3").val("");
			$("#searchExpndRptNo3").val("");
			$("#searchExpndRptTtl3").val("");
		break;
		
		
		case "expRptPrsl":
			$("#insttInfoId4").val("");
			$("#expndRptId4").val("");
			$("#searchExpndRptNo4").val("");
			$("#searchExpndRptTtl4").val("");
			$("#rlsY4").val("");
			$("#inptStts4").val("");
			$("#expndRptYmd4").val("");
			$("#bplcInfoId4").val("");
			$("#deptNm4").val("");
			$("#expndRptTtl4").val("");
			$("#rmrk4").val("");
			$("#expndRptSumAmt4").val("");
		break;
		
		
		case "prslSearch":
			$("#rangeDate5").val("3m").prop("selected", true);
			fn_rangeDate('expRptPrslSearchModal');
			$("#searchDeptCode5").val("");
			$("#searchDeptNm5").val("");
			$("#searchExpndRptNo5").val("");
			$("#searchExpndRptTtl5").val("");
		break;
		
		
		
	}
	
	return false;
}

function fn_selectAcltnCodeSet(){
	
	const newColumns = pcaDetailGrid.getColumns().map(column => {
        
		if( column.name === 'acntlCode' ){
          
			return {
						header: '계정과목'
					  , name: 'acntlCode'
			          , align: 'center'
                      ,	formatter: fn_selectFormatter		
					  , editor: { 
		   							type: 'select' 
								  , options: { listItems: fn_acntlCodeList() } 
    				  }
				};
        	}

        return column;
    });

	pcaDetailGrid.setColumns(newColumns);
	
	return false;
}

function fn_pcaDetailCntrl( se ){
	
	if( "" == $("#pcaDetailGrid").html() ){
		alert("신규등록 버튼을 눌러주시길 바랍니다.");
		return false;
	}
	
	switch( se ){
		
		case "add":
			pcaDetailGrid.appendRow(
				{	"acntlCode" : fn_acntlCodeList() ,
					"prdctNm" : "" ,
					"qy": "" ,
					"standard" : "" ,
					"unit" : "" ,
					"unpr" : 0 ,
					"cnptId" : "" ,
					"recptrNm " : "" ,
					"bankCd" : "" ,
					"bacntNo" : "" ,
					"cardNo" : "" ,
					"pcsActnAmt" : 0 ,
					"pcsActnAmtAll" : 0 ,
					"vat" : 0 },

					{focus: true});
					fn_selectAcltnCodeSet();
					//unpr 단가, pcsActnAmt 행위금액, vat 부가세
	let unprD = pcaDetailGrid.getColumnValues('unpr');
	let pcsActnAmtD = pcaDetailGrid.getColumnValues('pcsActnAmt');
	let vatD = pcaDetailGrid.getColumnValues('vat');
	

	console.log(unprD,"단가3");
	console.log(pcsActnAmtD,"행위금액3");
	console.log(vatD,"부가세3");
					
		break;
		
		
		case "delete":
			pcaDetailGrid.removeCheckedRows(true); // true일때 취소시 삭제 안됨.
		  	pcaDetailGrid.request('deleteData', {checkedOnly:true, showConfirm : false}); //showConfirm: 알림 제거
		  	//마스터 급액합계 표기 재계산
		  	//원인행위금액
			let pcsVal = pcaDetailGrid.getColumnValues('pcsActnAmt');
			let pcsAmt = 0;
			for(let set2 in pcsVal){
				pcsAmt += (Number)(pcsVal[set2])
			};	
				
			document.getElementById("pcsActnAmtInput").value = pcsAmt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');		  	
		  	//부가세금액
			let vatVal = pcaDetailGrid.getColumnValues('vat');
			let vatAmt = 0;
			for(let set2 in vatVal){
				vatAmt += (Number)(vatVal[set2])
			};
			
			document.getElementById("vatInput").value = vatAmt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');		  	
		  	//품의잔액 및 원인행위총액
			let AllVal = pcaDetailGrid.getColumnValues('pcsActnAmtAll');
			let pcsAmtAll = 0;
			for(let set2 in AllVal){
				pcsAmtAll += (Number)(AllVal[set2])
			};
			let expJanAmt = Number(document.getElementById("expndBlncInput").value.replace(/,/gi,"")) - pcsAmtAll;

			document.getElementById("expJanAmt").value = expJanAmt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
			document.getElementById("pcsAmtAll").value = pcsAmtAll.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');		  	
		break;
		
	}
	
	return false;
}





function fn_modalChoose( se , ev){
		//  selectBox 요소를 가져오기
	let bplcSelectBox = document.getElementById('bplcInfoId');
	
	switch( se ){
		

		

		
		case "cnptList":
			var selectedRow = integrationGrid.getCheckedRowKeys();
			
			if( selectedRow.length < 1 ){
				alert("거래처를 선택해주시기 바랍니다.");
				return false;
			}
			else if( 1 < selectedRow.length ){
				alert("거래처는 하나만 선택 가능합니다.");
				return false;
			}
			
			var selectDtlKey = $("#detailSelectedRowKey").val();
			pcaDetailGrid.setValue( selectDtlKey, 'cnptId', nullCheck(integrationGrid.getValue(selectedRow, "cnptId")));
			pcaDetailGrid.setValue( selectDtlKey, 'cnptNm', nullCheck(integrationGrid.getValue(selectedRow, "cnptNm")));
			fn_modalToggle('integrationModal', 'close');
		break;

		case "cardList":
			var selectedRow = integrationGrid.getCheckedRowKeys();
			
			if( selectedRow.length < 1 ){
				alert("카드를 선택해주시기 바랍니다.");
				return false;
			}
			else if( 1 < selectedRow.length ){
				alert("카드는 하나만 선택 가능합니다.");
				return false;
			}
			var selectDtlKey = $("#detailSelectedRowKey").val();
			pcaDetailGrid.setValue( selectDtlKey, 'cardNo', nullCheck(integrationGrid.getValue(selectedRow, "cardNo")));

			fn_modalToggle('integrationModal', 'close');
		break;
		
		case "rptReferenceModal":
			//픔의서참모모달 데이터셋
			fn_resetField('regist');
			
			// 배열을 초기화
			let selectOptions2 = [];
			let expRptReferenceGridVal = expRptReferenceGrid.getRow(ev.rowKey, ev.row);
			
			// selectBox의 길이만큼 반복하여 배열에 value와 text를 추가
			for (let i = 0; i < bplcSelectBox.length; i++) {
			  let option = bplcSelectBox[i];
			  selectOptions2.push({ value: option.value, text: option.text });
			}
			
			for (let j = 0; j < bplcSelectBox.length; j++) {
			  if(selectOptions2[j].value == expRptReferenceGridVal.bplcInfoId){
					/* Master Value */
					document.getElementById("expRptBplcInfoNmInput").value = selectOptions2[j].text;
					console.log(selectOptions2[j].text,"제이의벨류");
				}
			}
			
			console.log(expRptReferenceGridVal);
			/* Master Value */
			document.getElementById("expndRptId").value = expRptReferenceGridVal.expndRptId;
			document.getElementById("rptNoInput").value = expRptReferenceGridVal.expndRptNo;
			document.getElementById("rptSeqNoInput").value = expRptReferenceGridVal.expndRptSeqNo;
			document.getElementById("rptTtlInput").value = expRptReferenceGridVal.expndRptTtl;
			document.getElementById("deptCode").value = expRptReferenceGridVal.deptCd;
			document.getElementById("rptDeptInput").value = expRptReferenceGridVal.deptNm;
			document.getElementById("rptYmdInput").value = expRptReferenceGridVal.expndRptYmd;
			
			document.getElementById("docSttsInput").value = "";
			document.getElementById("docNoInput").value = "";
			
			document.getElementById("expndBgtCdInput").value = expRptReferenceGridVal.expndBgtCd;
			document.getElementById("expndPolicyInput").value = expRptReferenceGridVal.expndPolicy;
			document.getElementById("expndUnitInput").value = expRptReferenceGridVal.expndUnit;
			document.getElementById("expndDetailedInput").value = expRptReferenceGridVal.expndDetailed;
			document.getElementById("expndTxitmCdInput").value = expRptReferenceGridVal.expndTxitmCd;
			document.getElementById("expndTxitmNmInput").value = expRptReferenceGridVal.expndTxitmNm;
			document.getElementById("pcsActnAmtInput").value = '0';
			document.getElementById("vatInput").value = '0';
			document.getElementById("pcsAmtAll").value = '0';
			document.getElementById("expndRptAmtInput").value = expRptReferenceGridVal.expndRptAmt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
			var pcsActnUsedGramt = fn_pcsActnUsedGramtCall(expRptReferenceGridVal.expndRptId);
			var expndRptAmt = expRptReferenceGridVal.expndRptAmt;
			document.getElementById("pcsActnUsedGramtInput").value = pcsActnUsedGramt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
			var expndBlnc = Number(expndRptAmt) - Number(pcsActnUsedGramt);
			document.getElementById("expndBlncInput").value = expndBlnc.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
			var expJanAmt = expndBlnc - Number(document.getElementById("pcsAmtAll").value.replace(/,/gi,''));;
			document.getElementById("expJanAmt").value = expJanAmt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
			
			
			fn_modalToggle('rptReferenceModal', 'close');
			
		break;
		
		
		//원인행위검색그리드
		case "pcaSearchListGrid":
			let rptNo = document.getElementById("rptNoInput").value;
			console.log(rptNo.length);
			if( rptNo.length > 0 ){
				if(confirm("원인행위를 작성중입니다. 새로운 원인행위를 선택시\n작성중인 원인행위는 지워집니다. 허용하시겠습니까?")){
					
				}else{
					return false;
				}
			}
			
			
			//원인행위검색 데이터셋
			fn_resetField('regist');
			let pcaSearchGridVal = pcaSearchListGrid.getRow(ev.rowKey, ev.row);
			
			

			
			
			// 배열을 초기화
			let selectOptions = [];
			
			console.log(pcaSearchGridVal.bplcInfoId, "사업장코드찍기");
			// selectBox의 길이만큼 반복하여 배열에 value와 text를 추가
			for (let i = 0; i < bplcSelectBox.length; i++) {
			  let option = bplcSelectBox[i];
			  selectOptions.push({ value: option.value, text: option.text });
			}
			
			for (let j = 0; j < bplcSelectBox.length; j++) {
			  if(selectOptions[j].value == pcaSearchGridVal.bplcInfoId){
					/* Master Value */
					document.getElementById("expRptBplcInfoNmInput").value = selectOptions[j].text;
					console.log(selectOptions[j].text,"제이의벨류");
				}
			}
			
			// 결과 출력
			console.log(selectOptions,"결과출력");

			console.log(pcaSearchGridVal);
			var target = document.getElementById("bplcInfoId");
			let test = target.options[target.selectedIndex].value;
			let test2 = target.options[target.selectedIndex].text;
			console.log(test,"테스트1");
			console.log(test2,"테스트2");
			
			
			/* Master Value */
			$("#inptStts").val("수정");
			
			document.getElementById("pcsActnId").value = pcaSearchGridVal.pcsActnId;
			document.getElementById("pcsActnNoSearch").value = pcaSearchGridVal.pcsActnNo;
			document.getElementById("pcsActnNo").value = pcaSearchGridVal.pcsActnNo;
			document.getElementById("pcaTtlInput").value = pcaSearchGridVal.pcsActnTtl;
			
			document.getElementById("sumryTextarea").value = pcaSearchGridVal.sumry;
			
			document.getElementById("expndRptId").value = pcaSearchGridVal.expndRptId;
			document.getElementById("rptNoInput").value = pcaSearchGridVal.expndRptNo;
			document.getElementById("rptSeqNoInput").value = pcaSearchGridVal.expndRptSeqNo;
			document.getElementById("rptTtlInput").value = pcaSearchGridVal.expndRptTtl;
			document.getElementById("rptDeptInput").value = pcaSearchGridVal.deptNm;
			document.getElementById("rptYmdInput").value = pcaSearchGridVal.expndRptYmd;
			
			document.getElementById("docSttsInput").value = pcaSearchGridVal.approvalStatusNm;
			document.getElementById("approvalStatus").value = pcaSearchGridVal.approvalStatus;
			document.getElementById("docNoInput").value = "";
			
			document.getElementById("deptCode").value = pcaSearchGridVal.deptCode;
			document.getElementById("deptNm").value = pcaSearchGridVal.regDeptNm;
			document.getElementById("userInfoNm").value = pcaSearchGridVal.regNm;
			document.getElementById("userInfoId").value = pcaSearchGridVal.userInfoId;
			
			document.getElementById("expndBgtCdInput").value = pcaSearchGridVal.expndBgtCd;
			document.getElementById("expndPolicyInput").value = pcaSearchGridVal.expndPolicy;
			document.getElementById("expndUnitInput").value = pcaSearchGridVal.expndUnit;
			document.getElementById("expndDetailedInput").value = pcaSearchGridVal.expndDetailed;
			document.getElementById("expndTxitmCdInput").value = pcaSearchGridVal.expndTxitmCd;
			document.getElementById("expndTxitmNmInput").value = pcaSearchGridVal.expndTxitmNm;
			document.getElementById("expndRptAmtInput").value = pcaSearchGridVal.expndRptAmt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
			var pcsActnUsedGramt = fn_pcsActnUsedGramtCallUpdtMod(pcaSearchGridVal.expndRptId, pcaSearchGridVal.pcsActnId);
			var expndRptAmt = pcaSearchGridVal.expndRptAmt;
			document.getElementById("pcsActnUsedGramtInput").value = pcsActnUsedGramt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
			var expndBlnc = Number(expndRptAmt) - Number(pcsActnUsedGramt);
			document.getElementById("expndBlncInput").value = expndBlnc.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
			var expJanAmt = expndBlnc - Number(document.getElementById("pcsAmtAll").value.replace(/,/gi,''));
			document.getElementById("expJanAmt").value = expJanAmt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');			
			$("input[type='radio'][name='rlsYn'][value='" + (pcaSearchGridVal.rlsYn == null ? 'Y':pcaSearchGridVal.rlsYn) + "']").prop("checked", true);	
			
			//전자결재 연계폼 세팅
			$("#sector").val("MIS996");
			$("#key1").val(pcaSearchGridVal.pcsActnId);
			$("#key2").val($("#insttInfoId").val());
			$("#approvalStatusElc").val(pcaSearchGridVal.approvalStatus);

			
			fn_pcaDetailGridDraw();
			
			fn_editingFinish();

			fn_modalToggle('pcaSearchModal', 'close');
			

			
			
			
			
		break;
		
	}
	
	return false;
}

function fn_pcsActnUsedGramtCall(rptId){
	let pcsActnUsedGramt;
	var param = { 
		"expndRptId"  :  rptId
	};
	$.ajax({
		url: '/acn/pca/selectPcsActnUsedGramt.do'
	  , type: 'POST'
	  ,	data: JSON.stringify(param)
	  ,	dataType: 'json'
	  ,	async: false
	  , contentType : 'application/json; charset=utf-8'
	  , success: function(data) {
		
			let result = data;
			
			if( result != null){				
				pcsActnUsedGramt = 	result;		
			}
	  }
	  , error:function (request, status, error){
			alert("관리자에게 문의하세요. code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
	  }
		
	});
	
	
	return pcsActnUsedGramt;
}

function fn_pcsActnUsedGramtCallUpdtMod(rptId, actnId){
	let pcsActnUsedGramt;
	var param = { 
		"expndRptId"  :  rptId, "pcsActnId" : actnId
	};
	$.ajax({
		url: '/acn/pca/selectPcsActnUsedGramtUpdtMod.do'
	  , type: 'POST'
	  ,	data: JSON.stringify(param)
	  ,	dataType: 'json'
	  ,	async: false
	  , contentType : 'application/json; charset=utf-8'
	  , success: function(data) {
		
			let result = data;
			
			if( result != null){				
				pcsActnUsedGramt = 	result;		
			}
	  }
	  , error:function (request, status, error){
			alert("관리자에게 문의하세요. code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
	  }
		
	});
	
	
	return pcsActnUsedGramt;
}

function fn_rangeDate( se ){
	
	let currentDate = new Date();
	
	switch( se ){
		
		case "searchRptReferenceModal":
		console.log("렌지되는중");
			let selectedValue = $("#rangeDate").val();
			let startDate = fn_getRangeDate(selectedValue, currentDate);
			
			$("#rptReferenceStartDe").val( fn_formatDate(startDate) );
			$("#rptReferenceEndDe").val( fn_formatDate(currentDate) );
			
		break;
		
		
		case "pcaSearchModal":
		console.log("렌지2되는중");
			let pcaSelectedValue = $("#pcaRangeDate").val();
			let pcaStartDate = fn_getRangeDate(pcaSelectedValue, currentDate);
			
			$("#pcaSearchStartDe").val( fn_formatDate(pcaStartDate) );
			$("#pcaSearchEndDe").val( fn_formatDate(currentDate) );
			
		break;
		
		
		
		
	}
	
	return false;
}



function fn_getRangeDate( selectedValue, currentDate ){
	
	let startDate = "";
	
	switch( selectedValue ){
				
		case "3m":
			startDate = new Date(currentDate);
			startDate.setMonth(currentDate.getMonth() - 3);
		break;


		case "1m":
			startDate = new Date(currentDate);
			startDate.setMonth(currentDate.getMonth() - 1);
		break;


		case "1w":
			startDate = new Date(currentDate);
			startDate.setDate(currentDate.getDate() - 7);
		break;
			
	}
		
	return startDate;
}



/* 거래유형의 선택한 값 담는 전역변수 선택할 때마다 값을 담아줌. */
let selectedData = {
						"insttInfoId" : ""
						, "transType" : "" 
};







		
function fn_editingFinish(){
	//에디팅 종료
pcaDetailGrid.on('editingFinish', (ev) => {
		const { columnName } = ev;

 			if(columnName == 'pcsActnAmt'){
				let pcsVal = pcaDetailGrid.getColumnValues('pcsActnAmt');
				let pcsAmt = 0;
				for(let set2 in pcsVal){
					pcsAmt += (Number)(pcsVal[set2])
				};	
					
				document.getElementById("pcsActnAmtInput").value = pcsAmt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
				console.log(pcsAmt,"행위금액2");
			}
			
			if(columnName == 'vat'){
				let vatVal = pcaDetailGrid.getColumnValues('vat');
				let vatAmt = 0;
				for(let set2 in vatVal){
					vatAmt += (Number)(vatVal[set2])
				};	
					
				document.getElementById("vatInput").value = vatAmt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
				console.log(vatAmt,"부가세2");
			}
			
			console.log(ev,"이브이찍기");
			
			if(columnName == 'pcsActnAmt' || columnName == 'vat'){
				let AllVal = pcaDetailGrid.getColumnValues('pcsActnAmtAll');
				let pcsAmtAll = 0;
				for(let set2 in AllVal){
					pcsAmtAll += (Number)(AllVal[set2])
				};
				let expJanAmt = Number(document.getElementById("expndBlncInput").value.replace(/,/gi,"")) - pcsAmtAll;
				console.log(ev.rowKey,"변경중인 로우키");			
				if(expJanAmt<0) {
					alert("등록하려는 원인행위 금액이 현재 품의가능한 금액보다 큽니다. 금액을 조정해주세요.");
				}
				document.getElementById("expJanAmt").value = expJanAmt.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
				document.getElementById("pcsAmtAll").value = pcsAmtAll.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&,');
				console.log(AllVal,"행위총액2");
			}
		
		});
}



	




