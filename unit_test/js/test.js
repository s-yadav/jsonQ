(function(){
//test jsons
var indiaMain={
    "impPerson": [
        {
            "pname": "salman"
        },
        {
            "pname": "ajay dewgan"
        },
        {
            "pname": "Rajesh Khanna"
        },
        {
            "pname": "priyanka Chopra"
        }
    ],
    "states": [
        {
            "stateName": "mp",
            "impPerson": [
                {
                    "pname": "Akash Tiwari"
                },
                {
                    "pname": "Kedrinath Bansal"
                },
                {
                    "pname": "Sonam Kapur"
                }
            ],
			"population":{
				"total":20000,
				"average":10000
				},
            "city": [
                {
                    "cityName": "bhopal",
                    "impPerson": [
                        {
                            "pname": "Zahed Khan"
                        },
                        {
                            "pname": "chandrasekhar Thakkar"
                        },
                        {
                            "pname": "Kavita Kumari"
                        }
                    ],
					"population":{
						"total":30000,
						"average":20000
						}
                }
            ]
        },
        {
            "stateName": "cg",
            "impPerson": [
                {
                    "pname": "Anuj Sharma"
                },
                {
                    "pname": "Teejan Bai"
                },
                {
                    "pname": "Dilip Singh Judeo"
                },
                {
                    "pname": "Ajit Jogi"
                },
            ],
			"population":{
				"total":20000,
				"average":10100
				},

            "city": [
                {
                    "cityName": "raipur",
                    "impPerson": [
                        {
                            "pname": "Rakesh Sharma"
                        },
                        {
                            "pname": "Avinash Yadu"
                        }
                    ]
                },
                {
                    "cityName": "korba",
                    "impPerson": [
                        {
                            "pname": "Jogesh Lamba"
                        },
                        {
                            "pname": "Ankur Sharma"
                        },
                        {
                            "pname": "akshay Singh"
                        }
                    ]
                }
            ]
        }
    ]
}

//indiaMain = JSON.stringify(indiaMain);
 
var india=jsonQ.clone(indiaMain);

/*test start*/
test( "JSON Q initiailiztion test", function() {
	var init=jsonQ(india);
	ok( init,"this test is fine <br /> This is json <br /> " + jsonQ.prettify(init));
});


/*test start*/
module( "Traverse method test" );
test( "find", function() {
	var init=jsonQ(india),
		personName=init.find('pname'),
		value=personName.value(),
		response=["salman", "ajay dewgan", "Rajesh Khanna", "priyanka Chopra", "Akash Tiwari", "Kedrinath Bansal", "Sonam Kapur", "Zahed Khan", "chandrasekhar Thakkar", "Kavita Kumari", "Anuj Sharma", "Teejan Bai", "Dilip Singh Judeo", "Ajit Jogi", "Rakesh Sharma", "Avinash Yadu", "Jogesh Lamba", "Ankur Sharma", "akshay Singh"];
	//check response is coming properly
	deepEqual(value,response,"Giving right result for simple find.");
	
	ok( value.length==19,"Number of length of value is 19 ."+JSON.stringify(value));
	
	//check with qualifier.
	//i. with nth element 
	var filterdName=init.find('pname','2n');
	response=["salman","Rajesh Khanna","Akash Tiwari","Sonam Kapur","chandrasekhar Thakkar","Anuj Sharma","Dilip Singh Judeo","Rakesh Sharma","Jogesh Lamba","akshay Singh"];
	deepEqual(filterdName.value(),response,"Giving right result for simple find with nth qualifier.");
	
	var filterdName2=init.find('pname','nth(2n)');
	deepEqual(filterdName.value(),filterdName2.value(),"2n and nth(2n) is same.");

	//ii with equal
	var filterdName3=init.find('pname','2');
	response=["Rajesh Khanna"];
	deepEqual(filterdName3.value(),response,"Giving right result for simple find with index qualifier.");
	
	var filterdName4=init.find('pname','eq(2)');
	deepEqual(filterdName3.value(),filterdName4.value(),"2n and nth(2n) is same.");
	
	//filter with function qualifier
	var filterdName5=init.find('pname',function(){
			return this.toLowerCase().indexOf('aj')!=-1;
		});
	response=["ajay dewgan","Rajesh Khanna","Ajit Jogi"];	
	deepEqual(filterdName5.value(),response,"callback qualifier is working for find");


	//key value qualifier
	var keyValQualifier=init.find('population',{"total":20000});
	response=[{"total":20000,"average":10000},{"total":20000,"average":10100}];
	deepEqual(keyValQualifier.value(),response,"key value qualifier working perfectly");
	
	//multilevel find
	var multiLevelFind=init.find('city').find('impPerson',function(){
			return this.length==3;
		}).find('pname',function(){
			return this.toLowerCase().indexOf('sh')!=-1;
			});
	response=["Jogesh Lamba","Ankur Sharma","akshay Singh"];
	
	deepEqual(multiLevelFind.value(),response,"Multilevel find working(with qualifiers too)");
	
	//to test fint with inccrrect key.
	var falseTest=init.find('cities').find('impPerson',function(){
			return this.length==3;
		}).find('pname',function(){
			return this.toLowerCase().indexOf('sh')!=-1;
			});
	
	deepEqual(falseTest.value(),[],'False test working correctly if inncorrect key is passed it will retun empty array')
			
});

test('sibling',function(){
		var init=jsonQ(india),
			stateName=init.find('stateName');
		
		//test simple sibling works or not
		var sibling=stateName.sibling('impPerson'),
			result=    [[{"pname":"Akash Tiwari"},{"pname":"Kedrinath Bansal"},{"pname":"Sonam Kapur"}],[{"pname":"Anuj Sharma"},{"pname":"Teejan Bai"},{"pname":"Dilip Singh Judeo"},{"pname":"Ajit Jogi"}]];
		deepEqual(sibling.value(),result,'Simple sibling work right');
		
		//test sibling with function qualifier
		var sibling2=stateName.sibling('impPerson',function(){return this.length==3});
			result=    [[{"pname":"Akash Tiwari"},{"pname":"Kedrinath Bansal"},{"pname":"Sonam Kapur"}]];
		deepEqual(sibling2.value(),result,'Qualifier sibling work right');
		
		//test sibling with nth elm with undefined index
		var sibling3=stateName.sibling('impPerson','2');
		
		deepEqual(sibling3.value(),[],'Undefined index is giving null empty array');

		//sibling with nth qualifier 
		var sibling4=stateName.sibling('impPerson','1');
			result=    [[{"pname":"Anuj Sharma"},{"pname":"Teejan Bai"},{"pname":"Dilip Singh Judeo"},{"pname":"Ajit Jogi"}]];
		deepEqual(sibling4.value(),result,'sibling with nth qualifier working fine');
		
		//test multivel with sibling
		var pname=sibling4.find('pname');
			result=    ["Anuj Sharma","Teejan Bai","Dilip Singh Judeo","Ajit Jogi"];
		deepEqual(pname.value(),result,'multivel with sibling working');

	});
	
	//test parent method
	test('parent',function(){
			var init=jsonQ(india),
				cityName=init.find('cityName',function(){ return this=="bhopal"});
			
			
			//test multilevel traverse after parent
			var pname=cityName.parent().find('pname'),
				result=["Zahed Khan","chandrasekhar Thakkar","Kavita Kumari"];
			deepEqual(pname.value(),result,'Parent method working');
			
			//test parent on the initial object
			deepEqual(init.parent().value(),[],'Parent of initial object should give empty which is working fine');
		})
		
	//test closest method
	test('closest',function(){
				var init=jsonQ(india),
				pname=init.find('pname');
				
				//impPerson
				var impPerson=pname.closest('impPerson'),
					result=[[{"pname":"salman"},{"pname":"ajay dewgan"},{"pname":"Rajesh Khanna"},{"pname":"priyanka Chopra"}],[{"pname":"Akash Tiwari"},{"pname":"Kedrinath Bansal"},{"pname":"Sonam Kapur"}],[{"pname":"Zahed Khan"},{"pname":"chandrasekhar Thakkar"},{"pname":"Kavita Kumari"}],[{"pname":"Anuj Sharma"},{"pname":"Teejan Bai"},{"pname":"Dilip Singh Judeo"},{"pname":"Ajit Jogi"}],[{"pname":"Rakesh Sharma"},{"pname":"Avinash Yadu"}],[{"pname":"Jogesh Lamba"},{"pname":"Ankur Sharma"},{"pname":"akshay Singh"}]];
				
				
				deepEqual(impPerson.value(),result,'Simple closest test 1 successfull');
				
				//to test multilevel through closest
				var filteredPname=pname.closest('city').find('pname');
				result=["Zahed Khan","chandrasekhar Thakkar","Kavita Kumari","Rakesh Sharma","Avinash Yadu","Jogesh Lamba","Ankur Sharma","akshay Singh"];
				
				
				deepEqual(filteredPname.value(),result,'Multi level traverse through closest works');

				//closest with wrong key
				var cities=pname.closest('cities');
				deepEqual(cities.value(),[],'Tested with wrong key should come empty working fine');

	})	

	module( "Filter method test" );
	//test filter method

		test('filter',function(){
				var init=jsonQ(india),
				pname=init.find('pname');
				
		//filter with function qualifier
		var filterdName=pname.filter(function(){
				return this.toLowerCase().indexOf('aj')!=-1;
			});
		response=["ajay dewgan","Rajesh Khanna","Ajit Jogi"];	
		deepEqual(filterdName.value(),response,"callback filter is working");
	
	
		//key value qualifier
		var keyValQualifier=init.find('population').filter({"total":20000});
		response=[{"total":20000,"average":10000},{"total":20000,"average":10100}];
		deepEqual(keyValQualifier.value(),response,"key value filter working perfectly");


		//multilevel filter test
		var average=keyValQualifier.filter({'average':10100}) .find('average');
		response=[10100];
		deepEqual(average.value(),response,"Multi level filter working perfectly");
	})	

	module( "Manipulation method test " );
	//test filter method

		test('value as setter',function(){
				var init=jsonQ(india),
				pname=init.find('pname');
				
		//set value of filtered name
		
		pname.filter(function(){
				return this.toLowerCase().indexOf('aj')!=-1;
			}).value('sammy');
		result=["salman","sammy","sammy","priyanka Chopra","Akash Tiwari","Kedrinath Bansal","Sonam Kapur","Zahed Khan","chandrasekhar Thakkar","Kavita Kumari","Anuj Sharma","Teejan Bai","Dilip Singh Judeo","sammy","Rakesh Sharma","Avinash Yadu","Jogesh Lamba","Ankur Sharma","akshay Singh"];
		deepEqual(pname.refresh().value(),result,"Simple value setter working correctly");
		
		//test callback value setter
		var filtered=pname.filter(function(){
				return this.toLowerCase().indexOf('a')!=-1;
			}).value(function(data){
					return data.replace(/a/g,'@');
				});
		
		
		result=["s@lm@n","s@mmy","s@mmy","priy@nk@ Chopr@","Ak@sh Tiw@ri","Kedrin@th B@ns@l","Son@m K@pur","Z@hed Kh@n","ch@ndr@sekh@r Th@kk@r","K@vit@ Kum@ri","Anuj Sh@rm@","Teej@n B@i","Dilip Singh Judeo","s@mmy","R@kesh Sh@rm@","Avin@sh Y@du","Jogesh L@mb@","Ankur Sh@rm@","@ksh@y Singh"];
				
		deepEqual(pname.refresh().value(),result,"Callback value setter working correctly");
		
		
		});	
		
		test('append',function(){
				var init=jsonQ(india),
				pname=init.find('pname'),
				impPerson=init.find('impPerson');

				//test append
				pname.append('nb');
				var result=["s@lm@nnb","s@mmynb","s@mmynb","priy@nk@ Chopr@nb","Ak@sh Tiw@rinb","Kedrin@th B@ns@lnb","Son@m K@purnb","Z@hed Kh@nnb","ch@ndr@sekh@r Th@kk@rnb","K@vit@ Kum@rinb","Anuj Sh@rm@nb","Teej@n B@inb","Dilip Singh Judeonb","s@mmynb","R@kesh Sh@rm@nb","Avin@sh Y@dunb","Jogesh L@mb@nb","Ankur Sh@rm@nb","@ksh@y Singhnb"];
				
				deepEqual(pname.refresh().value(),result,"Append is working fine");

				//test append on array
 				impPerson.append({'pname':'sammy'},true);
				result=[[{"pname":"s@lm@nnb"},{"pname":"s@mmynb"},{"pname":"s@mmynb"},{"pname":"priy@nk@ Chopr@nb"},{"pname":"sammy"}],[{"pname":"Ak@sh Tiw@rinb"},{"pname":"Kedrin@th B@ns@lnb"},{"pname":"Son@m K@purnb"},{"pname":"sammy"}],[{"pname":"Z@hed Kh@nnb"},{"pname":"ch@ndr@sekh@r Th@kk@rnb"},{"pname":"K@vit@ Kum@rinb"},{"pname":"sammy"}],[{"pname":"Anuj Sh@rm@nb"},{"pname":"Teej@n B@inb"},{"pname":"Dilip Singh Judeonb"},{"pname":"s@mmynb"},{"pname":"sammy"}],[{"pname":"R@kesh Sh@rm@nb"},{"pname":"Avin@sh Y@dunb"},{"pname":"sammy"}],[{"pname":"Jogesh L@mb@nb"},{"pname":"Ankur Sh@rm@nb"},{"pname":"@ksh@y Singhnb"},{"pname":"sammy"}]];
				deepEqual(impPerson.refresh().value(),result,"Append on array is working fine");
				//ok(true,JSON.stringify(impPerson.refresh().value()));

			});
		
		//to test prepend method
		test('prepend',function(){
				var init=jsonQ(india),
				pname=init.find('pname'),
				impPerson=init.find('impPerson');

				//test prepend
				pname.prepend('st');
				var result=["sts@lm@nnb","sts@mmynb","sts@mmynb","stpriy@nk@ Chopr@nb","stsammy","stAk@sh Tiw@rinb","stKedrin@th B@ns@lnb","stSon@m K@purnb","stsammy","stZ@hed Kh@nnb","stch@ndr@sekh@r Th@kk@rnb","stK@vit@ Kum@rinb","stsammy","stAnuj Sh@rm@nb","stTeej@n B@inb","stDilip Singh Judeonb","sts@mmynb","stsammy","stR@kesh Sh@rm@nb","stAvin@sh Y@dunb","stsammy","stJogesh L@mb@nb","stAnkur Sh@rm@nb","st@ksh@y Singhnb","stsammy"];
				
				deepEqual(pname.refresh().value(),result,"Prepend is working fine");

				//test prepend on array
 				impPerson.prepend({'pname':'sammy'},true);
				result=[[{"pname":"sammy"},{"pname":"sts@lm@nnb"},{"pname":"sts@mmynb"},{"pname":"sts@mmynb"},{"pname":"stpriy@nk@ Chopr@nb"},{"pname":"stsammy"}],[{"pname":"sammy"},{"pname":"stAk@sh Tiw@rinb"},{"pname":"stKedrin@th B@ns@lnb"},{"pname":"stSon@m K@purnb"},{"pname":"stsammy"}],[{"pname":"sammy"},{"pname":"stZ@hed Kh@nnb"},{"pname":"stch@ndr@sekh@r Th@kk@rnb"},{"pname":"stK@vit@ Kum@rinb"},{"pname":"stsammy"}],[{"pname":"sammy"},{"pname":"stAnuj Sh@rm@nb"},{"pname":"stTeej@n B@inb"},{"pname":"stDilip Singh Judeonb"},{"pname":"sts@mmynb"},{"pname":"stsammy"}],[{"pname":"sammy"},{"pname":"stR@kesh Sh@rm@nb"},{"pname":"stAvin@sh Y@dunb"},{"pname":"stsammy"}],[{"pname":"sammy"},{"pname":"stJogesh L@mb@nb"},{"pname":"stAnkur Sh@rm@nb"},{"pname":"st@ksh@y Singhnb"},{"pname":"stsammy"}]];
				//ok(true,JSON.stringify(impPerson.refresh().value()));
				deepEqual(impPerson.refresh().value(),result,"Prepend on array is working fine");
			});

		//to test appendat method
		test('appendAt',function(){
				var init=jsonQ(india),
				pname=init.find('pname'),
				impPerson=init.find('impPerson');

				//test prepend
				pname.appendAt(2,'&&');
				var result=["sa&&mmy","st&&s@lm@nnb","st&&s@mmynb","st&&s@mmynb","st&&priy@nk@ Chopr@nb","st&&sammy","sa&&mmy","st&&Ak@sh Tiw@rinb","st&&Kedrin@th B@ns@lnb","st&&Son@m K@purnb","st&&sammy","sa&&mmy","st&&Z@hed Kh@nnb","st&&ch@ndr@sekh@r Th@kk@rnb","st&&K@vit@ Kum@rinb","st&&sammy","sa&&mmy","st&&Anuj Sh@rm@nb","st&&Teej@n B@inb","st&&Dilip Singh Judeonb","st&&s@mmynb","st&&sammy","sa&&mmy","st&&R@kesh Sh@rm@nb","st&&Avin@sh Y@dunb","st&&sammy","sa&&mmy","st&&Jogesh L@mb@nb","st&&Ankur Sh@rm@nb","st&&@ksh@y Singhnb","st&&sammy"];
				//ok(true,JSON.stringify(pname.refresh().value()));
				
				deepEqual(pname.refresh().value(),result,"appendAt is working fine");

				//test prepend on array
 				impPerson.appendAt(2,{'pname':'sammy'},true);
				result=[[{"pname":"sa&&mmy"},{"pname":"st&&s@lm@nnb"},{"pname":"sammy"},{"pname":"st&&s@mmynb"},{"pname":"st&&s@mmynb"},{"pname":"st&&priy@nk@ Chopr@nb"},{"pname":"st&&sammy"}],[{"pname":"sa&&mmy"},{"pname":"st&&Ak@sh Tiw@rinb"},{"pname":"sammy"},{"pname":"st&&Kedrin@th B@ns@lnb"},{"pname":"st&&Son@m K@purnb"},{"pname":"st&&sammy"}],[{"pname":"sa&&mmy"},{"pname":"st&&Z@hed Kh@nnb"},{"pname":"sammy"},{"pname":"st&&ch@ndr@sekh@r Th@kk@rnb"},{"pname":"st&&K@vit@ Kum@rinb"},{"pname":"st&&sammy"}],[{"pname":"sa&&mmy"},{"pname":"st&&Anuj Sh@rm@nb"},{"pname":"sammy"},{"pname":"st&&Teej@n B@inb"},{"pname":"st&&Dilip Singh Judeonb"},{"pname":"st&&s@mmynb"},{"pname":"st&&sammy"}],[{"pname":"sa&&mmy"},{"pname":"st&&R@kesh Sh@rm@nb"},{"pname":"sammy"},{"pname":"st&&Avin@sh Y@dunb"},{"pname":"st&&sammy"}],[{"pname":"sa&&mmy"},{"pname":"st&&Jogesh L@mb@nb"},{"pname":"sammy"},{"pname":"st&&Ankur Sh@rm@nb"},{"pname":"st&&@ksh@y Singhnb"},{"pname":"st&&sammy"}]];
				//ok(true,JSON.stringify(impPerson.refresh().value()));
				deepEqual(impPerson.refresh().value(),result,"appendAt on array is working fine");
			});
		
		test('sort',function(){
				var indiaC=jsonQ.clone(indiaMain),
					init=jsonQ(indiaC);

				//simple sort
				init.sort('pname');
				init.refresh();
				
				//sort test on ascending
				var result=[{"impPerson":[{"pname":"ajay dewgan"},{"pname":"priyanka Chopra"},{"pname":"Rajesh Khanna"},{"pname":"salman"}],"states":[{"stateName":"cg","impPerson":[{"pname":"Ajit Jogi"},{"pname":"Anuj Sharma"},{"pname":"Dilip Singh Judeo"},{"pname":"Teejan Bai"}],"population":{"total":20000,"average":10100},"city":[{"cityName":"korba","impPerson":[{"pname":"akshay Singh"},{"pname":"Ankur Sharma"},{"pname":"Jogesh Lamba"}]},{"cityName":"raipur","impPerson":[{"pname":"Avinash Yadu"},{"pname":"Rakesh Sharma"}]}]},{"stateName":"mp","impPerson":[{"pname":"Akash Tiwari"},{"pname":"Kedrinath Bansal"},{"pname":"Sonam Kapur"}],"population":{"total":20000,"average":10000},"city":[{"cityName":"bhopal","impPerson":[{"pname":"chandrasekhar Thakkar"},{"pname":"Kavita Kumari"},{"pname":"Zahed Khan"}],"population":{"total":30000,"average":20000}}]}]}];
				
				deepEqual(init.value(),result,'Basic sort working');
				
				//sort test on descending
				var indiaC=jsonQ.clone(indiaMain),
					init=jsonQ(indiaC);

				//Decending  sort
				init.sort('pname',{'order':"DESC"});
				init.refresh();
				
				result=[{"impPerson":[{"pname":"salman"},{"pname":"Rajesh Khanna"},{"pname":"priyanka Chopra"},{"pname":"ajay dewgan"}],"states":[{"stateName":"cg","impPerson":[{"pname":"Teejan Bai"},{"pname":"Dilip Singh Judeo"},{"pname":"Anuj Sharma"},{"pname":"Ajit Jogi"}],"population":{"total":20000,"average":10100},"city":[{"cityName":"raipur","impPerson":[{"pname":"Rakesh Sharma"},{"pname":"Avinash Yadu"}]},{"cityName":"korba","impPerson":[{"pname":"Jogesh Lamba"},{"pname":"Ankur Sharma"},{"pname":"akshay Singh"}]}]},{"stateName":"mp","impPerson":[{"pname":"Sonam Kapur"},{"pname":"Kedrinath Bansal"},{"pname":"Akash Tiwari"}],"population":{"total":20000,"average":10000},"city":[{"cityName":"bhopal","impPerson":[{"pname":"Zahed Khan"},{"pname":"Kavita Kumari"},{"pname":"chandrasekhar Thakkar"}],"population":{"total":30000,"average":20000}}]}]}];
				deepEqual(init.value(),result,'Sort on decending working');

				//sort test on descending with case sensitive
				init.sort('pname',{'order':"DESC","caseIgnore":false});
				init.refresh();
				result=[{"impPerson":[{"pname":"salman"},{"pname":"priyanka Chopra"},{"pname":"ajay dewgan"},{"pname":"Rajesh Khanna"}],"states":[{"stateName":"cg","impPerson":[{"pname":"Teejan Bai"},{"pname":"Dilip Singh Judeo"},{"pname":"Anuj Sharma"},{"pname":"Ajit Jogi"}],"population":{"total":20000,"average":10100},"city":[{"cityName":"korba","impPerson":[{"pname":"akshay Singh"},{"pname":"Jogesh Lamba"},{"pname":"Ankur Sharma"}]},{"cityName":"raipur","impPerson":[{"pname":"Rakesh Sharma"},{"pname":"Avinash Yadu"}]}]},{"stateName":"mp","impPerson":[{"pname":"Sonam Kapur"},{"pname":"Kedrinath Bansal"},{"pname":"Akash Tiwari"}],"population":{"total":20000,"average":10000},"city":[{"cityName":"bhopal","impPerson":[{"pname":"chandrasekhar Thakkar"},{"pname":"Zahed Khan"},{"pname":"Kavita Kumari"}],"population":{"total":30000,"average":20000}}]}]}];
				deepEqual(init.value(),result,'Sort on decending with case sensitive working fine');


				//sort with custom logic
				init.sort('pname',{"logic":function(val){
						return val.length;
					}});
				init.refresh();
				result=[{"impPerson":[{"pname":"salman"},{"pname":"ajay dewgan"},{"pname":"Rajesh Khanna"},{"pname":"priyanka Chopra"}],"states":[{"stateName":"cg","impPerson":[{"pname":"Ajit Jogi"},{"pname":"Teejan Bai"},{"pname":"Anuj Sharma"},{"pname":"Dilip Singh Judeo"}],"population":{"total":20000,"average":10100},"city":[{"cityName":"korba","impPerson":[{"pname":"akshay Singh"},{"pname":"Jogesh Lamba"},{"pname":"Ankur Sharma"}]},{"cityName":"raipur","impPerson":[{"pname":"Avinash Yadu"},{"pname":"Rakesh Sharma"}]}]},{"stateName":"mp","impPerson":[{"pname":"Sonam Kapur"},{"pname":"Akash Tiwari"},{"pname":"Kedrinath Bansal"}],"population":{"total":20000,"average":10000},"city":[{"cityName":"bhopal","impPerson":[{"pname":"Zahed Khan"},{"pname":"Kavita Kumari"},{"pname":"chandrasekhar Thakkar"}],"population":{"total":30000,"average":20000}}]}]}];
				deepEqual(init.value(),result,'Sort with custom logic is working fine working fine');

				//sort test on only last level
				var indiaC=jsonQ.clone(indiaMain),
					init=jsonQ(indiaC);

				//Only bottom level sort
				init.sort('pname',{'allLevel':false});
				init.refresh();

				result=[{"impPerson":[{"pname":"ajay dewgan"},{"pname":"priyanka Chopra"},{"pname":"Rajesh Khanna"},{"pname":"salman"}],"states":[{"stateName":"mp","impPerson":[{"pname":"Akash Tiwari"},{"pname":"Kedrinath Bansal"},{"pname":"Sonam Kapur"}],"population":{"total":20000,"average":10000},"city":[{"cityName":"bhopal","impPerson":[{"pname":"chandrasekhar Thakkar"},{"pname":"Kavita Kumari"},{"pname":"Zahed Khan"}],"population":{"total":30000,"average":20000}}]},{"stateName":"cg","impPerson":[{"pname":"Ajit Jogi"},{"pname":"Anuj Sharma"},{"pname":"Dilip Singh Judeo"},{"pname":"Teejan Bai"}],"population":{"total":20000,"average":10100},"city":[{"cityName":"raipur","impPerson":[{"pname":"Avinash Yadu"},{"pname":"Rakesh Sharma"}]},{"cityName":"korba","impPerson":[{"pname":"akshay Singh"},{"pname":"Ankur Sharma"},{"pname":"Jogesh Lamba"}]}]}]}];
				deepEqual(init.value(),result,'Only lower level sort working fine');

			});
		
		//test refresh method
		test("refresh",function(){
				var indiaC=jsonQ.clone(indiaMain),
					init=jsonQ(indiaC),
				impPerson=init.find('impPerson',function(){
						return this.length>2;
					}),
				pname=impPerson.find('pname',function(){
						return this.indexOf('ma')!=-1;
					});
				
				impPerson.append({'pname':'marma'});
				
				var result=["salman","marma","marma","Kavita Kumari","marma","Anuj Sharma","marma","Ankur Sharma","marma"];
				
				deepEqual(pname.refresh().value(),result,"refersh method is working for multilevel also")
			});
		
		
		module('Test return methods');
		//to test index method
		test('index',function(){
				var indiaC=jsonQ.clone(indiaMain);
				var init=jsonQ(indiaC),
				pname=init.find('pname'),
				impPerson=init.find('impPerson');
				
				//test index  with a string
				var index=pname.index('ajay dewgan');
				deepEqual(index,1,"Simple index is working fine.");
				
				//object to find index
				var testAry=[{a:'b'},{b:'c'},{c:'d'}]
				deepEqual(jsonQ.index(testAry,{c:'d'}),2,"Find index of object.");
				
				
				//index as qualifier
				var index2=impPerson.index({"pname":"ajay dewgan"},true)
				deepEqual(index2,0,"Passing a object in index is working fine.");
				
				
				//index as function qualifier
				var index3=impPerson.index(function(){
						return this[0].pname.indexOf('Ak')!=-1
					},true)

				deepEqual(index3,1,"Function qualifier for index is working.");
				
				//test for multiple condition in array index
				var testAry2=[[1,2,3,4],[3,4,5,6],[3,6,1],[2,4,6],[1,7,9]];
				var index4=jsonQ.index(testAry2,[3,6],true);
				deepEqual(index4,1,"Multiple conditions as array qualifier woking.");
				
				//test for multiple condition in object
				var testAry3=[{a:'b',c:"d",e:"f"},{a:'b',c:"2",e:"5"},{a:'1',c:"d",e:"9"}]
				deepEqual(jsonQ.index(testAry3,{c:'d',a:"1"},true),2,"Find with multiple condition as key value pair in index.");
			});	
			
		//test createXML
		test('createXML',function(){
				var indiaC=jsonQ.clone(indiaMain),
				indiaObj=jsonQ(indiaC);
				
				var xml=indiaObj.createXML(),
				result="<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?><jsonXML><arrayItem type=\"object\"><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[salman]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[ajay dewgan]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Rajesh Khanna]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[priyanka Chopra]]></pname></arrayItem></impPerson><states type=\"array\"><arrayItem type=\"object\"><stateName type=\"string\"><![CDATA[mp]]></stateName><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Akash Tiwari]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Kedrinath Bansal]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Sonam Kapur]]></pname></arrayItem></impPerson><population type=\"object\"><total type=\"number\"><![CDATA[20000]]></total><average type=\"number\"><![CDATA[10000]]></average></population><city type=\"array\"><arrayItem type=\"object\"><cityName type=\"string\"><![CDATA[bhopal]]></cityName><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Zahed Khan]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[chandrasekhar Thakkar]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Kavita Kumari]]></pname></arrayItem></impPerson><population type=\"object\"><total type=\"number\"><![CDATA[30000]]></total><average type=\"number\"><![CDATA[20000]]></average></population></arrayItem></city></arrayItem><arrayItem type=\"object\"><stateName type=\"string\"><![CDATA[cg]]></stateName><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Anuj Sharma]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Teejan Bai]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Dilip Singh Judeo]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Ajit Jogi]]></pname></arrayItem></impPerson><population type=\"object\"><total type=\"number\"><![CDATA[20000]]></total><average type=\"number\"><![CDATA[10100]]></average></population><city type=\"array\"><arrayItem type=\"object\"><cityName type=\"string\"><![CDATA[raipur]]></cityName><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Rakesh Sharma]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Avinash Yadu]]></pname></arrayItem></impPerson></arrayItem><arrayItem type=\"object\"><cityName type=\"string\"><![CDATA[korba]]></cityName><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Jogesh Lamba]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Ankur Sharma]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[akshay Singh]]></pname></arrayItem></impPerson></arrayItem></city></arrayItem></states></arrayItem></jsonXML>";
				deepEqual(xml,result,"Create XML with jsonQ object is working fine.");

				//create xml with simple object
				var xml=jsonQ.createXML(indiaC);
				//console.log(xml);
				result=	

"<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?><jsonXML><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[salman]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[ajay dewgan]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Rajesh Khanna]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[priyanka Chopra]]></pname></arrayItem></impPerson><states type=\"array\"><arrayItem type=\"object\"><stateName type=\"string\"><![CDATA[mp]]></stateName><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Akash Tiwari]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Kedrinath Bansal]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Sonam Kapur]]></pname></arrayItem></impPerson><population type=\"object\"><total type=\"number\"><![CDATA[20000]]></total><average type=\"number\"><![CDATA[10000]]></average></population><city type=\"array\"><arrayItem type=\"object\"><cityName type=\"string\"><![CDATA[bhopal]]></cityName><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Zahed Khan]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[chandrasekhar Thakkar]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Kavita Kumari]]></pname></arrayItem></impPerson><population type=\"object\"><total type=\"number\"><![CDATA[30000]]></total><average type=\"number\"><![CDATA[20000]]></average></population></arrayItem></city></arrayItem><arrayItem type=\"object\"><stateName type=\"string\"><![CDATA[cg]]></stateName><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Anuj Sharma]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Teejan Bai]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Dilip Singh Judeo]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Ajit Jogi]]></pname></arrayItem></impPerson><population type=\"object\"><total type=\"number\"><![CDATA[20000]]></total><average type=\"number\"><![CDATA[10100]]></average></population><city type=\"array\"><arrayItem type=\"object\"><cityName type=\"string\"><![CDATA[raipur]]></cityName><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Rakesh Sharma]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Avinash Yadu]]></pname></arrayItem></impPerson></arrayItem><arrayItem type=\"object\"><cityName type=\"string\"><![CDATA[korba]]></cityName><impPerson type=\"array\"><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Jogesh Lamba]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[Ankur Sharma]]></pname></arrayItem><arrayItem type=\"object\"><pname type=\"string\"><![CDATA[akshay Singh]]></pname></arrayItem></impPerson></arrayItem></city></arrayItem></states></jsonXML>";
				deepEqual(xml,result,"Create XML with normal object is working fine.");
	
			
			});	
		
		//test order
		test('order',function(){
				var obj={
					'bahanaksjdk':[{a:'b',c:'a',b:[{a:'b',c:'a',b:'d'},{a:1}]},{a:'b'},{a:'b'}],
					'd':[1,2,3],
					'c':'c',
					'a':'c',
					'1':'av',
					'11':'acv',
					'2':'def'
					}

				
				var clone=jsonQ.clone(obj);
				jsonQ.order(clone);
				var result='{"1":"av","2":"def","11":"acv","a":"c","bahanaksjdk":[{"a":"b","b":[{"a":"b","b":"d","c":"a"},{"a":1}],"c":"a"},{"a":"b"},{"a":"b"}],"c":"c","d":[1,2,3]}';
				deepEqual(JSON.stringify(clone),result,"Serialize is working fine.");
				
			});
			
		//test identical
		test('identical',function(){
				var indiaC=jsonQ.clone(indiaMain);
				ok(jsonQ.identical(indiaMain,indiaC),'Identical method is working properly');
				
				//test for different order of objects
				var testObj1={a:'b',b:'c'}
				var testObj2={b:'c',a:'b'}

				ok(jsonQ.identical(testObj1,testObj2),'Identical method is working for different order of keys in object');
			});	

		
		module( "Global Method Test" );	
		
		//test merge
		test('merge',function(){
				//simple merge test 
				var json1={
						"a":"1",
						"b":"2",
						"c":"3"
					}
				
				var json2={
						"a":"3",
						"d":{"a":3}
				
					}					
				var json3=jsonQ.merge({},json1,json2);
				
				var result={"a":"3","b":"2","c":"3","d":{"a":3}};
				
				deepEqual(json3,result,'JSON merge is working fine');
				
				//merge two arrays
				var ary1=[1,2,3,4],
					ary2=[3,4,5,6,7],
					ary3=jsonQ.merge([],ary1,ary2);
				
				ary2[3]=88;
				var result=[3,4,5,6,7];
				deepEqual(ary3,result,'array merge is working fine');


				//test deep maerge
				ary1=[{a:1,b:2},{a:3,d:4},{a:{"a":"3","b":"2"}}];
				ary2=[{a:2,e:3},{a:9,f:4},{a:{"g":"3","b":"8"}},{e:9}];
				ary3=jsonQ.merge(true,[],ary1,ary2);
				
				ary2[3].e=8;
				
				result=[{"a":2,"b":2,"e":3},{"a":9,"d":4,"f":4},{"a":{"a":"3","b":"8","g":"3"}},{"e":9}];
				deepEqual(ary3,result,'deep merge is working fine');
									
			});
			
		//test array sort
		test('sort array',function(){
				var aryMain=["salman","Rajesh Khanna","Akash Tiwari","Sonam Kapur","chandrasekhar Thakkar","Anuj Sharma","Dilip Singh Judeo","Rakesh Sharma","Jogesh Lamba","akshay Singh"],
					
					//simple array sort test 
					ary=jsonQ.clone(aryMain);
					jsonQ.sort(ary);
					result=["Akash Tiwari", "akshay Singh", "Anuj Sharma", "chandrasekhar Thakkar", "Dilip Singh Judeo", "Jogesh Lamba", "Rajesh Khanna", "Rakesh Sharma", "salman", "Sonam Kapur"];
					deepEqual(ary,result,'Simple sort is working');
					
					//sort with logic and other options
					ary=jsonQ.clone(aryMain);
					jsonQ.sort(ary,{logic:function(val){ return val.length;}});
					result=["salman", "Sonam Kapur", "Anuj Sharma", "Akash Tiwari", "Jogesh Lamba", "akshay Singh", "Rajesh Khanna", "Rakesh Sharma", "Dilip Singh Judeo", "chandrasekhar Thakkar"];
					deepEqual(ary,result,'Logic sort is working');
					
					//sort with other options
					ary=jsonQ.clone(aryMain);
					jsonQ.sort(ary,{"order": "DESC", "caseIgnore": false});
					result=["salman", "chandrasekhar Thakkar", "akshay Singh", "Sonam Kapur", "Rakesh Sharma", "Rajesh Khanna", "Jogesh Lamba", "Dilip Singh Judeo", "Anuj Sharma", "Akash Tiwari"];
					deepEqual(ary,result,'Other options of  sort is working');
	
					//sort with other options
				var aryMain=[{a:"b"},{a:"a"},{a:[1,5,3]}]
					ary=jsonQ.clone(aryMain);
					jsonQ.sort(ary);
					result=[{"a":"a"},{"a":"b"},{"a":[1,5,3]}];
					deepEqual(ary,result,'Object sort is working');			
					
			});	
			
		//test nth elemnt method
		test('nth element',function(){
				var ary=[];
				for(var i=1; i<=100; i++){
					ary[i-1]=i;
					}
				
				var testAry=[];
				//test nth pattern
				testAry.push(jsonQ.nthElm(ary,'2n+1'));
				
				//test first
				testAry.push(jsonQ.nthElm(ary,'first'));
	
				//test last
				testAry.push(jsonQ.nthElm(ary,'last'));

				//test even
				testAry.push(jsonQ.nthElm(ary,'even'));

				//test odd
				testAry.push(jsonQ.nthElm(ary,'odd'));

				//test index
				testAry.push(jsonQ.nthElm(ary,3));

				var result=[[2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100],1,100,[1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99],[2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100],4];

				deepEqual(testAry,result,'Nth element is working fine');			

			});	
	
		//test array methods
		module('Array method test');
		test('unique',function(){
				//test for simple array
				var ary=[1,2,1,3,4,2];
				deepEqual(jsonQ.unique(ary),[1,2,3,4],"Simple unique is working.")
				
				//test for array of objects
				var ary=[{a:2},{a:3},{a:2}];
				deepEqual(jsonQ.unique(ary),[{a:2},{a:3}],"Unique is working for array of objects.")
				
			});
			
		test("shuffle",function(){
				var ary=[1,2,1,3,4,2];
				ary2=jsonQ.shuffle(jsonQ.clone(ary));
				ok(ary.length==ary2.length && !jsonQ.identical(ary,ary2),'shuffle is working right.')
			});
			
		test("union",function(){
				//test simple array
				var ary1=[1,2,4,5,7],
					ary2=[2,3,5,8],
					ary3=[2,5,6,9],
					ary4=jsonQ.union(ary1,ary2,ary3);

				deepEqual(ary4,[1,2,4,5,7,3,8,6,9],"Union is working for simple array.")
					
				//test union of objects
				var ary1=[{a:1},{a:2},{a:4},{a:5},{a:7}],
					ary2=[{a:2},{a:3},{a:5},{a:8}],
					ary3=[{a:2},{a:5},{a:6},{a:9}],
					ary4=jsonQ.union(ary1,ary2,ary3);

				deepEqual(ary4,[{a:1},{a:2},{a:4},{a:5},{a:7},{a:3},{a:8},{a:6},{a:9}],"Union is working for array of objects.")
				
			
			});	

		test("intersection",function(){
				//test simple array
				var ary1=[1,2,4,5,7],
					ary2=[2,3,5,8],
					ary3=[2,5,6,9],
					ary4=jsonQ.intersection(ary1,ary2,ary3);

				deepEqual(ary4,[2,5],"Intersection is working for simple array.")
					
				//test intersection of objects
				var ary1=[{a:1},{a:2},{a:4},{a:5},{a:7}],
					ary2=[{a:2},{a:3},{a:5},{a:8}],
					ary3=[{a:2},{a:5},{a:6},{a:9}],
					ary4=jsonQ.intersection(ary1,ary2,ary3);

				deepEqual(ary4,[{a:2},{a:5}],"Intersection is working for array of objects.")
				
				//test intersection with only one paramete
				deepEqual(ary1,[{a:1},{a:2},{a:4},{a:5},{a:7}],"Intersection is working for only one argument.")
			
			});	
		
		//test set pat value
		test("setPathValue",function(){
				//test set path value when their is key presend
				var a=[{a:{b:2}}] ,b=[];
				
				deepEqual(jsonQ.setPathValue(a,[0,'a','b'],3),[{a:{b:3}}],"Simple setPathValue is working .")
				
				//test if keys are not present
				var res=jsonQ.setPathValue(b,[0,'a',0,'b'],3);
				deepEqual(res,[{a:[{b:3}]}],"setPathValue is working too if key is not present.")

			});	
		
		//test append ,prepend and appendAt on simple array
		test("append ,prepend, appendAt - global",function(){
				//append ,prepend, appendAt on array
				var ary=[1,2,3,4,5];
				jsonQ.append(ary,6);
				jsonQ.prepend(ary,0)
				jsonQ.appendAt(ary,2,1.5)
				
				deepEqual(ary,[0, 1, 1.5, 2, 3, 4, 5, 6],'append methods are working fine');
				
				//append ,prepend, appendAt on array
				var name='sammy';
				name=jsonQ.append(name,'y');
				name=jsonQ.prepend(name,'s')
				name=jsonQ.appendAt(name,2,'aaa')
				deepEqual(name,'ssaaaammyy','append methods on string are working fine');

			});
		
})();
