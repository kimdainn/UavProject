//자바와 자바스크립트간의 통신을 위한 객체
var jsproxy = {	
	//-------------------------------------------------------
	//MapViewController.java의 zoomSlider의 value를 변경했을 경우 지도를 확대/축소
	//MapViewController.java -> jsproxy.js
	//지도 확대/축소 설정
	//일반지도(zoom 범위: 0~22)
	//위성사진(zoom 범위: 0~19)
	setMapZoom: function(zoom) {
		try {
			map.googlemap.setZoom(zoom);
		} catch(err) {
			console.log(">> [jsproxy.setMapZoom()] " + err);
		}
	},
	//-------------------------------------------------------
	//MapViewController.java의 imgBtnMapFix 클릭 시, 드론이 지도의 중앙으로 이동 방지 / 이동
	//MapViewController.java -> jsproxy.js
	//드론이 지도로 중앙 이동 방지/이동
	setMapFix: function(bool){
		try {
			map.mapFixStatus = bool;
		} catch(err) {
			console.log(">> [jsproxy.setMapFix() " + err);
		}
	},
	//-------------------------------------------------------
	// MapViewController.java의 lblSatellite or lblMap 클릭 시, 이벤트 발생 후
	// jsproxy.js setMapType 호출
	// isSatellite 값이 매개값으로 넘겨줘서 setMapTypeId("satellite")인지 setMapTypeId("roadmap")을 결정 
	setMapType: function(bool){
		try {
			if(bool) {
				map.googlemap.setMapTypeId("satellite")
			} else {
				map.googlemap.setMapTypeId("roadmap")
			}
		} catch(err) {
			console.log(">> [jsproxy.setMapType() " + err);
		}
	},
	//-------------------------------------------------------
	//지도 상에서 마우스휠로 확대/축소할 경우 MapViewController.java의 zoomSlider의 value 변경
	//jsproxy.js -> MapViewController.java
	setZoomSliderValue: function(zoom) {
		try {
			jsproxy.java.setZoomSliderValue(zoom);
		} catch(err) {
			console.log(">> [jsproxy.setZoomSliderValue()] " + err);
		}
	},			
	//-------------------------------------------------------
	//처음 이륙 위치
	//GPS가 Fix되어야 됨
	setHomeLocation: function(latitude, longitude) {
		try {
			map.uav.setHomeLocation(latitude, longitude);
		} catch(err) {
			console.log(">> [jsproxy.setHomeLocation()] " + err);
		}
	},
	//-------------------------------------------------------
	//UAV의 현재 위치를 설정
	//latitude: 위도
	//longitude: 경도
	//heading: UAV 머리 방향(북:0, 동:90, 남:180, 서:270)
	setUavLocation: function(latitude, longitude, heading) {
		try {
			map.uav.setCurrLocation(latitude, longitude, heading);
		} catch(err) {
			console.log(">> [jsproxy.setUavLocation()] " + err);
		}	
	},
	//-------------------------------------------------------
	gotoMake: function() {
		try {
			map.gotoMake = true;
			map.roiMake = false;
			map.missionMake = false;
			map.fenceMake = false;
			map.noFlyZoneMake = false;
		} catch(err) {
			console.log(">> [jsproxy.gotoMake()] " + err);
		}
	},

	gotoStart: function(location) {
		try {
			console.log("test1 location:" + location);
			location = JSON.stringify(location);
			console.log("test2 location:" + location);
			jsproxy.java.gotoStart(location);
			console.log("test3 location:" + location);
			map.uav.missionStop();
		} catch(err) {
			console.log(">> [jsproxy.gotoStart()] " + err);
		}
	},
	
	gotoStop: function() {
		map.gotoMake = false;
		map.uav.gotoStop();
	},
	
	//복귀
	//location: 목표지점 좌표
	rtlStart: function() {
		try {
			map.uav.rtlStart();
		} catch(err) {
			console.log(">> [jsproxy.rtl()] " + err);
		}
	},
	//-------------------------------------------------------
	missionMake: function(altitude) {
		try {
			map.gotoMake = false;
			map.missionMake = true;			
			map.roiMake = false;
			map.fenceMake = false;
			map.noFlyZoneMake = false;
			map.uav.alt = altitude;
		} catch(err) {
			console.log(">> [jsproxy.missionMake()] " + err);
		}	
	},
	//-------------------------------------------------------
	getMission: function() {
		try {
			var mission = [];
			for(var i=0; i<map.uav.missionMarkers.length; i++) {
				var json = {
					no: map.uav.missionMarkers[i].index+1,
					kind: map.uav.missionMarkers[i].kind,
					lat: map.uav.missionMarkers[i].getPosition().lat(),
					lng: map.uav.missionMarkers[i].getPosition().lng(),
					jump: map.uav.missionMarkers[i].jump,
					repeat: map.uav.missionMarkers[i].repeat,
					alt: map.uav.missionMarkers[i].alt
				};
				mission.push(json);
			}
			mission = JSON.stringify(mission);
			jsproxy.java.getMissionResponse(mission);
		} catch(err) {
			console.log(">> [jsproxy.getMission()] " + err);
		}
	},
	//-------------------------------------------------------
	setMission: function(strMessionArr) {
		try {
			var missionArr = JSON.parse(strMessionArr);
			map.uav.setMission(missionArr);
		} catch(err) {
			console.log(">> [jsproxy.setMission()] " + err);
		}
	},
	//-------------------------------------------------------
	missionStart: function() {
		try {
			map.uav.missionStart();
		} catch(err) {
			console.log(">> [jsproxy.missionStart()] " + err);
		}
	},
	//-------------------------------------------------------
	missionStop: function() {
		try {
			map.uav.missionStop();
		} catch(err) {
			console.log(">> [jsproxy.missionStop()] " + err);
		}	
	},
	//-------------------------------------------------------
	setNextWaypointNo: function(nextWaypointNo) {
		try {
			map.uav.setNextWaypointNo(nextWaypointNo);
		} catch(err) {
			console.log(">> [jsproxy.setNextWaypointNo()] " + err);
		}
	},
	//-------------------------------------------------------
	roiMake: function(selectedIndex) {
		try {
			map.gotoMake = false;
			map.missionMake = false;
			map.roiMake = true;
			map.fenceMake = false;
			map.noFlyZoneMake = false;
			map.uav.roiIndex = selectedIndex+1;
		} catch(err) {
			console.log(">> [jsproxy.roiMake()] " + err);
		}
	},
	addROI: function(location) {
		try {
			location = JSON.stringify(location);
			jsproxy.java.addROI(location);
		} catch(err) {
			console.log(">> [jsproxy.addROI()] " + err);
		}
	},
	//-------------------------------------------------------
	addTakeoff: function(lat, lng, index, alt) {
		try {
			map.uav.makeMissionMark("takeoff", lat, lng ,index, alt);
		} catch(err) {
			console.log(">> [jsproxy.addTakeoff()] " + err);
		}
	},
	//-------------------------------------------------------
	addRTL: function() {
		try {
			map.uav.makeMissionMark("rtl");
		} catch(err) {
			console.log(">> [jsproxy.addRTL()] " + err);
		}
	},
	//-------------------------------------------------------
	addJump: function(jumpWPLat, jumpWPLng, selectedIndex, alt, jumpIndex, repeat) {
		try {
			map.uav.makeMissionMark("jump", jumpWPLat, jumpWPLng, selectedIndex, alt, "", jumpIndex, repeat);
		} catch(err) {
			console.log(">> [jsproxy.addJump()] " + err);
		}
	},
	//-------------------------------------------------------
	addLand: function(lat, lng, selectedIndex) {
		try {
			map.uav.makeMissionMark("land", lat, lng, selectedIndex);
		} catch(err) {
			console.log(">> [jsproxy.addLand()] " + err);
		}
	},
	//-------------------------------------------------------
	missionClear: function() {
		try {
			map.uav.clearMission();
		} catch(err) {
			console.log(">> [jsproxy.missionClear()] " + err);
		}
	},
	//-------------------------------------------------------
	modifyWayPoint: function(latitude, longitude, selecetedIndex, alt, kind, jump, repeat) {
		try {
			map.uav.makeMissionMark("modifiedWayPoint", latitude, longitude, selecetedIndex, alt, kind, jump, repeat);
		} catch(err) {
			console.log(">> [jsproxy.modifyWayPoint()] " + err);
		}
	},
	//-------------------------------------------------------
	modifyFencePoint: function(latitude, longitude, selecetedIndex) {
		try {
			map.uav.makeFenceMark("modifiedFencePoint", latitude, longitude, selecetedIndex);
		} catch(err) {
			console.log(">> [jsproxy.modifyFencePoint()] " + err);
		}
	},
	//-------------------------------------------------------
	addNoFlyZone: function(latitude, longtitude, radius) {
		try {
			map.uav.addNoFlyZone(latitude, longtitude, radius);
		} catch(err) {
			console.log(">> [jsproxy.addNoFlyZone()] " + err);
		}
	},
	//-------------------------------------------------------
	removeMissionMarker: function(selectedIndex) {
		try {
			map.uav.removeMissionMark(selectedIndex);
		} catch(err) {
			console.log(">> [jsproxy.removeMissionMarker()] " + err);
		}
	},
	//-------------------------------------------------------
	fenceMake: function() {
		try {
			map.gotoMake = false;
			map.missionMake = false;			
			map.roiMake = false;
			map.fenceMake = true;
			map.noFlyZoneMake = false;
		} catch(err) {
			console.log(">> [jsproxy.fenceMake()] " + err);
		}	
	},
	removeFenceMarker: function(selectedIndex) {
		try {
			map.uav.removeFenceMark(selectedIndex);
		} catch(err) {
			console.log(">> [jsproxy.removeFenceMarker()] " + err);
		}
	},
	modifyFencePoint: function(latitude, longitude, selecetedIndex) {
		try {
			map.uav.makeFenceMark(latitude, longitude, "modifiedFencePoint", selecetedIndex);
		} catch(err) {
			console.log(">> [jsproxy.modifyFencePoint()] " + err);
		}
	},
	fenceUpload: function() {
		try {
			var points = [];
			
			//index 0 is return point
			points.push(map.uav.homeLocation);
			
			for(var i=0; i<map.uav.fenceMarkers.length; i++) {
				points.push({lat:map.uav.fenceMarkers[i].getPosition().lat(), lng:map.uav.fenceMarkers[i].getPosition().lng()});
			}
			
			//last point is 0 index point for polygon
			points.push({lat:map.uav.fenceMarkers[0].getPosition().lat(), lng:map.uav.fenceMarkers[0].getPosition().lng()});
			
			points = JSON.stringify(points);
			jsproxy.java.fenceUpload(points);
		} catch(err) {
			console.log(">> [jsproxy.fenceUpload()] " + err);
		}
	},
	getFence: function() {
		try {
			var fence = [];
			for(var i=0; i<map.uav.fenceMarkers.length; i++) {
				var json = {
					no: map.uav.fenceMarkers[i].index+1,
					lat: map.uav.fenceMarkers[i].getPosition().lat(),
					lng: map.uav.fenceMarkers[i].getPosition().lng()
				};
				fence.push(json);
			}
			fence = JSON.stringify(fence);
			jsproxy.java.getFenceResponse(fence);
		} catch(err) {
			console.log(">> [jsproxy.getFence()] " + err);
		}
	},
	fenceClear: function() {
		map.uav.fenceClear();
	},
	//-------------------------------------------------------
	setFence: function(strFenceArr) {
		try {
			var fenceArr = JSON.parse(strFenceArr);
			var fencePoints = [];
			for(var i=1; i<(fenceArr.length-1); i++) {
				fencePoints.push({lat:fenceArr[i].lat, lng:fenceArr[i].lng});
			}
			map.uav.setFence(fencePoints);
		} catch(err) {
			console.log(">> [jsproxy.setFence()] " + err);
		}
	},
	//-------------------------------------
	getNoFlyZone: function() {
		try {
			var noflyzone = [];
			for(var i=0; i<map.uav.noflyZoneMarkers.length; i++) {
				var json = {
					no: map.uav.noflyZoneMarkers[i].index+1,
					lat: map.uav.noflyZoneMarkers[i].getPosition().lat(),
					lng: map.uav.noflyZoneMarkers[i].getPosition().lng()
				};
				noflyzone.push(json);
			}
			noflyzone = JSON.stringify(noflyzone);
			jsproxy.java.getNoFlyZoneResponse(noflyzone);
		} catch(err) {
			console.log(">> [jsproxy.getNoFlyZone()] " + err);
		}
	},
	noFlyZoneMake: function() {
		try {
			map.gotoMake = false;
			map.missionMake = false;			
			map.roiMake = false;
			map.fenceMake = false;
			map.noFlyZoneMake = true;
		} catch(err) {
			console.log(">> [jsproxy.noFlyZoneMake()] " + err);
		}	
	},
	
	removeNoFlyZone: function(selectedIndex, isClicked_imgNoFlyZoneView) {
		try {
			map.uav.removeNoFlyZone(selectedIndex, isClicked_imgNoFlyZoneView);
		} catch(err) {
			console.log(">> [jsproxy.removeNoFlyZone()] " + err);
		}
	}
};

