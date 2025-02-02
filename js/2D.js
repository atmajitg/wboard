/*****
*
*   The contents of this file were written by Kevin Lindsey
*   copyright 2006 Kevin Lindsey
*
*   This file was compacted by jscompact
*   A Perl utility written by Kevin Lindsey (kevin@kevlindev.com)
*
*****/
var svg = document.getElementById("canvas");
var D2isTouch = false;
//Array.prototype.foreach=function(func){var length=this.length;for(var i=0;i<length;i++){func(this[i]);}};
//Array.prototype.grep=function(func){var length=this.length;var result=[];for(var i=0;i<length;i++){var elem=this[i];if(func(elem)){result.push(elem);}}return result;};
//Array.prototype.map=function(func){var length=this.length;var result=[];for(var i=0;i<length;i++){result.push(func(this[i]));}return result;};
//Array.prototype.min=function(){var length=this.length;var min=this[0];for(var i=0;i<length;i++){var elem=this[i];if(elem<min)min=elem;}return min;}
//Array.prototype.max=function(){var length=this.length;var max=this[0];for(var i=0;i<length;i++)var elem=this[i];if(elem>max)max=elem;return max;}
AntiZoomAndPan.VERSION="1.2"
function AntiZoomAndPan(){this.init();}
AntiZoomAndPan.prototype.init=function(){var svgRoot=svg;this.svgNodes=new Array();this.x_trans=0;this.y_trans=0;this.scale=1;this.lastTM=svgRoot.createSVGMatrix();svgRoot.addEventListener('SVGZoom',this,false);svgRoot.addEventListener('SVGScroll',this,false);svgRoot.addEventListener('SVGResize',this,false);};
AntiZoomAndPan.prototype.appendNode=function(svgNode){this.svgNodes.push(svgNode);};
AntiZoomAndPan.prototype.removeNode=function(svgNode){for(var i=0;i<this.svgNodes.length;i++){if(this.svgNodes[i]===svgNode){this.svgNodes.splice(i,1);break;}}};
AntiZoomAndPan.prototype.handleEvent=function(e){var type=e.type;if(this[type]==null)throw new Error("Unsupported event type: "+type);this[type](e);};
AntiZoomAndPan.prototype.SVGZoom=function(e){this.update();};
AntiZoomAndPan.prototype.SVGScroll=function(e){this.update();};
AntiZoomAndPan.prototype.SVGResize=function(e){this.update();};
AntiZoomAndPan.prototype.update=function(){if(this.svgNodes.length>0){var svgRoot=svg;var viewbox=(window.ViewBox!=null)?new ViewBox(svgRoot):null;var matrix=(viewbox!=null)?viewbox.getTM():svgRoot.createSVGMatrix();var trans=svgRoot.currentTranslate;matrix=matrix.scale(1.0/svgRoot.currentScale);matrix=matrix.translate(-trans.x,-trans.y);for(var i=0;i<this.svgNodes.length;i++){var node=this.svgNodes[i];var CTM=matrix.multiply(this.lastTM.multiply(node.getCTM()));var transform="matrix("+[CTM.a,CTM.b,CTM.c,CTM.d,CTM.e,CTM.f].join(",")+")";this.svgNodes[i].setAttributeNS(null,"transform",transform);}this.lastTM=matrix.inverse();}};
EventHandler.VERSION=1.0;
function EventHandler(){this.init();};
EventHandler.prototype.init=function(){};
EventHandler.prototype.handleEvent=function(e){
    e.preventDefault();
   // svg.getElementById("info").textContent+=e.type;
    if(e.type.startsWith("touch")){
        if (e.changedTouches.length === 1) {
            //svg.getElementById("info").textContent+=3;
            //evt.preventDefault();
            var touch = e.changedTouches[0];
            var x = touch.pageX
                y = touch.pageY
            var eventType = "";
            if(e.type=="touchstart"){
                eventType="mousedown";
            }else if(e.type=="touchmove"){
                eventType="mousemove";
            }else{
                eventType="mouseup";
            }
           // svg.getElementById("info").textContent+=4;
            if(this[eventType]==null)throw new Error("Unsupported event type: "+e.type);
            //e.preventDefault();
            //svg.getElementById("info").textContent+=5;
            this[eventType](e,x,y);
        }
    }else if(e.type.startsWith("mouse")){
            var x = e.clientX
            y = e.clientY
            if(this[e.type]==null)throw new Error("Unsupported event type: "+e.type);
            //e.preventDefault();
            this[e.type](e,x,y);
    }else{
        if(this[e.type]==null)throw new Error("Unsupported event type: "+e.type);
        this[e.type](e);
    }
};
var svgns="http://www.w3.org/2000/svg";
Mouser.prototype=new EventHandler();
Mouser.prototype.constructor=Mouser;
Mouser.superclass=EventHandler.prototype;
function Mouser(){this.init();}
Mouser.prototype.init=function(){this.svgNode=null;this.handles=new Array();this.shapes=new Array();this.lastPoint=null;this.currentNode=null;this.realize();};
Mouser.prototype.realize=function(){if(this.svgNode==null){var rect=document.createElementNS(svgns,"rect");this.svgNode=rect;rect.setAttributeNS(null,"x","-16384");rect.setAttributeNS(null,"y","-16384");rect.setAttributeNS(null,"width","32767");rect.setAttributeNS(null,"height","32767");rect.setAttributeNS(null,"fill","none");rect.setAttributeNS(null,"pointer-events","all");rect.setAttributeNS(null,"display","none");svg.appendChild(rect);}};
Mouser.prototype.register=function(handle){if(this.handleIndex(handle)==-1){var owner=handle.owner;handle.select(true);this.handles.push(handle);if(owner!=null&&this.shapeIndex(owner)==-1)this.shapes.push(owner);}};
Mouser.prototype.unregister=function(handle){var index=this.handleIndex(handle);if(index!=-1){handle.select(false);this.handles.splice(index,1);}};
Mouser.prototype.registerShape=function(shape){if(this.shapeIndex(shape)==-1){shape.select(true);this.shapes.push(shape);}};
Mouser.prototype.unregisterShape=function(shape){var index=this.shapeIndex(shape);if(index!=-1){shape.select(false);shape.selectHandles(false);shape.showHandles(false);shape.unregisterHandles();this.shapes.splice(index,1);}};
Mouser.prototype.unregisterAll=function(){for(var i=0;i<this.handles.length;i++){this.handles[i].select(false);}this.handles=new Array();};
Mouser.prototype.unregisterShapes=function(){for(var i=0;i<this.shapes.length;i++){var shape=this.shapes[i];shape.select(false);shape.selectHandles(false);shape.showHandles(false);shape.unregisterHandles();}this.shapes=new Array();};
Mouser.prototype.handleIndex=function(handle){var result=-1;for(var i=0;i<this.handles.length;i++){if(this.handles[i]===handle){result=i;break;}}return result;};
Mouser.prototype.shapeIndex=function(shape){var result=-1;for(var i=0;i<this.shapes.length;i++){if(this.shapes[i]===shape){result=i;break;}}return result;};
Mouser.prototype.beginDrag=function(e,x,y){
    this.currentNode=e.target;
    var svgPoint=this.getUserCoordinate(this.currentNode,x,y);
    this.lastPoint=new Point2D(svgPoint.x,svgPoint.y);
    mouser.addEvent("release",this.svgNode,this);
    mouser.addEvent("move",this.svgNode,this);
    svg.appendChild(this.svgNode);
    this.svgNode.setAttributeNS(null,"display","inline");
};
Mouser.prototype.mouseup=function(){
    this.lastPoint=null;
    this.currentNode=null;
    mouser.removeEvent("release",this.svgNode,this);
    mouser.removeEvent("move",this.svgNode,this);
    this.svgNode.setAttributeNS(null,"display","none");
    for(var i=0;i<this.shapes.length;i++){
        var shape=this.shapes[i];
        if(shape.mouseup)shape.mouseup();
    }

};
Mouser.prototype.mousemove=function(e,x,y){
    var svgPoint=this.getUserCoordinate(this.currentNode,x,y);
    var newPoint=new Point2D(svgPoint.x,svgPoint.y);
    var delta=newPoint.subtract(this.lastPoint);
    var updates=new Array();var updateId=new Date().getTime();
    this.lastPoint.setFromPoint(newPoint);
    for(var i=0;i<this.handles.length;i++){
        var handle=this.handles[i];var owner=handle.owner;
        handle.translate(delta);if(owner!=null){if(owner.lastUpdate!=updateId){owner.lastUpdate=updateId;updates.push(owner);}}else{updates.push(handle);}}for(var i=0;i<updates.length;i++){updates[i].update();}};
Mouser.prototype.getUserCoordinate=function(node,x,y){var svgRoot=svg;var pan=svgRoot.currentTranslate;var zoom=svgRoot.currentScale;var CTM=this.getTransformToElement(node);var iCTM=CTM.inverse();var worldPoint=svg.createSVGPoint();worldPoint.x=(x-pan.x)/zoom;worldPoint.y=(y-pan.y)/zoom;return worldPoint.matrixTransform(iCTM);};
Mouser.prototype.getTransformToElement=function(node){var CTM=node.getCTM();while((node=node.parentNode)!=svg){CTM=node.getCTM().multiply(CTM);}return CTM;};
Mouser.prototype.addEvent=function(type,target,object){
    if (type=="press") {
        //if(!isTouchDevice){
            target.addEventListener("mousedown",object,false);
       // }else{
            target.addEventListener("touchstart",object,{ 'passive': false });
       // }
    }
    if (type=="move") {
       // if(!isTouchDevice){
            target.addEventListener("mousemove",object,false);
       // }else{
            target.addEventListener("touchmove",object,{ 'passive': false });
       // }
    }
    if (type=="click") {
            target.addEventListener("click",object,false);
    }
    if (type=="release") {
       // if(!isTouchDevice){
            target.addEventListener("mouseup",object,false);
            target.addEventListener("mouseleave",object,false);
       // }else{
            target.addEventListener("touchleave",object,{ 'passive': false });
            target.addEventListener("touchend",object,{ 'passive': false });
            target.addEventListener("touchcancel",object,{ 'passive': false });
       // }
    }
};
Mouser.prototype.removeEvent=function(type,target,object){
    if (type=="press") {
        target.removeEventListener("mousedown",object,false);
        target.removeEventListener("touchstart",object,false);
    }
    if (type=="move") {
        target.removeEventListener("mousemove",object,false);
        target.removeEventListener("touchmove",object,false);
    }
    if (type=="release") {
            target.removeEventListener("mouseup",object,false);
            target.removeEventListener("mouseleave",object,false);
            target.removeEventListener("touchleave",object,false);
            target.removeEventListener("touchend",object,false);
            target.removeEventListener("touchcancel",object,false);
    }
}
ViewBox.VERSION="1.0";
function ViewBox(svgNode){if(arguments.length>0){this.init(svgNode);}}
ViewBox.prototype.init=function(svgNode){var viewBox=svgNode.getAttributeNS(null,"viewBox");var preserveAspectRatio=svgNode.getAttributeNS(null,"preserveAspectRatio");if(viewBox!=null&&viewBox!=""){var params=viewBox.split(/\s*,\s*|\s+/);this.x=parseFloat(params[0]);this.y=parseFloat(params[1]);this.width=parseFloat(params[2]);this.height=parseFloat(params[3]);}else{this.x=0;this.y=0;this.width=innerWidth;this.height=innerHeight;}this.setPAR(preserveAspectRatio);};
ViewBox.prototype.getTM=function(){var svgRoot=svg;var matrix=svg.createSVGMatrix();var windowWidth=svgRoot.getAttributeNS(null,"width");var windowHeight=svgRoot.getAttributeNS(null,"height");if(windowWidth!=null&&windowWidth!=""){windowWidth=parseFloat(windowWidth);}else{if(window.innerWidth){windowWidth=innerWidth;}else{windowWidth=document.svg.width;}}if(windowHeight!=null&&windowHeight!=""){windowHeight=parseFloat(windowHeight);}else{if(window.innerHeight){windowHeight=innerHeight;}else{windowHeight=svg.viewport.height;}}var x_ratio=this.width/windowWidth;var y_ratio=this.height/windowHeight;matrix=matrix.translate(this.x,this.y);if(this.alignX=="none"){matrix=matrix.scaleNonUniform(x_ratio,y_ratio);}else{if(x_ratio<y_ratio&&this.meetOrSlice=="meet"||x_ratio>y_ratio&&this.meetOrSlice=="slice"){var x_trans=0;var x_diff=windowWidth*y_ratio-this.width;if(this.alignX=="Mid")x_trans=-x_diff/2;else if(this.alignX=="Max")x_trans=-x_diff;matrix=matrix.translate(x_trans,0);matrix=matrix.scale(y_ratio);}else if(x_ratio>y_ratio&&this.meetOrSlice=="meet"||x_ratio<y_ratio&&this.meetOrSlice=="slice"){var y_trans=0;var y_diff=windowHeight*x_ratio-this.height;if(this.alignY=="Mid")y_trans=-y_diff/2;else if(this.alignY=="Max")y_trans=-y_diff;matrix=matrix.translate(0,y_trans);matrix=matrix.scale(x_ratio);}else{matrix=matrix.scale(x_ratio);}}return matrix;}
ViewBox.prototype.setPAR=function(PAR){if(PAR){var params=PAR.split(/\s+/);var align=params[0];if(align=="none"){this.alignX="none";this.alignY="none";}else{this.alignX=align.substring(1,4);this.alignY=align.substring(5,9);}if(params.length==2){this.meetOrSlice=params[1];}else{this.meetOrSlice="meet";}}else{this.align="xMidYMid";this.alignX="Mid";this.alignY="Mid";this.meetOrSlice="meet";}};
function Intersection(status){if(arguments.length>0){this.init(status);}}
Intersection.prototype.init=function(status){this.status=status;this.points=new Array();};
Intersection.prototype.appendPoint=function(point){this.points.push(point);};
Intersection.prototype.appendPoints=function(points){this.points=this.points.concat(points);};
Intersection.intersectShapes=function(shape1,shape2){var ip1=shape1.getIntersectionParams();var ip2=shape2.getIntersectionParams();var result;if(ip1!=null&&ip2!=null){if(ip1.name=="Path"){result=Intersection.intersectPathShape(shape1,shape2);}else if(ip2.name=="Path"){result=Intersection.intersectPathShape(shape2,shape1);}else{var method;var params;if(ip1.name<ip2.name){method="intersect"+ip1.name+ip2.name;params=ip1.params.concat(ip2.params);}else{method="intersect"+ip2.name+ip1.name;params=ip2.params.concat(ip1.params);}if(!(method in Intersection))throw new Error("Intersection not available: "+method);result=Intersection[method].apply(null,params);}}else{result=new Intersection("No Intersection");}return result;};
Intersection.intersectPathShape=function(path,shape){return path.intersectShape(shape);};
Intersection.intersectBezier2Bezier2=function(a1,a2,a3,b1,b2,b3){var a,b;var c12,c11,c10;var c22,c21,c20;var TOLERANCE=1e-4;var result=new Intersection("No Intersection");a=a2.multiply(-2);c12=a1.add(a.add(a3));a=a1.multiply(-2);b=a2.multiply(2);c11=a.add(b);c10=new Point2D(a1.x,a1.y);a=b2.multiply(-2);c22=b1.add(a.add(b3));a=b1.multiply(-2);b=b2.multiply(2);c21=a.add(b);c20=new Point2D(b1.x,b1.y);var a=c12.x*c11.y-c11.x*c12.y;var b=c22.x*c11.y-c11.x*c22.y;var c=c21.x*c11.y-c11.x*c21.y;var d=c11.x*(c10.y-c20.y)+c11.y*(-c10.x+c20.x);var e=c22.x*c12.y-c12.x*c22.y;var f=c21.x*c12.y-c12.x*c21.y;var g=c12.x*(c10.y-c20.y)+c12.y*(-c10.x+c20.x);var poly=new Polynomial(-e*e,-2*e*f,a*b-f*f-2*e*g,a*c-2*f*g,a*d-g*g);var roots=poly.getRoots();for(var i=0;i<roots.length;i++){var s=roots[i];if(0<=s&&s<=1){var xRoots=new Polynomial(-c12.x,-c11.x,-c10.x+c20.x+s*c21.x+s*s*c22.x).getRoots();var yRoots=new Polynomial(-c12.y,-c11.y,-c10.y+c20.y+s*c21.y+s*s*c22.y).getRoots();if(xRoots.length>0&&yRoots.length>0){checkRoots:for(var j=0;j<xRoots.length;j++){var xRoot=xRoots[j];if(0<=xRoot&&xRoot<=1){for(var k=0;k<yRoots.length;k++){if(Math.abs(xRoot-yRoots[k])<TOLERANCE){result.points.push(c22.multiply(s*s).add(c21.multiply(s).add(c20)));break checkRoots;}}}}}}}return result;};
Intersection.intersectBezier2Bezier3=function(a1,a2,a3,b1,b2,b3,b4){var a,b,c,d;var c12,c11,c10;var c23,c22,c21,c20;var result=new Intersection("No Intersection");a=a2.multiply(-2);c12=a1.add(a.add(a3));a=a1.multiply(-2);b=a2.multiply(2);c11=a.add(b);c10=new Point2D(a1.x,a1.y);a=b1.multiply(-1);b=b2.multiply(3);c=b3.multiply(-3);d=a.add(b.add(c.add(b4)));c23=new Vector2D(d.x,d.y);a=b1.multiply(3);b=b2.multiply(-6);c=b3.multiply(3);d=a.add(b.add(c));c22=new Vector2D(d.x,d.y);a=b1.multiply(-3);b=b2.multiply(3);c=a.add(b);c21=new Vector2D(c.x,c.y);c20=new Vector2D(b1.x,b1.y);var c10x2=c10.x*c10.x;var c10y2=c10.y*c10.y;var c11x2=c11.x*c11.x;var c11y2=c11.y*c11.y;var c12x2=c12.x*c12.x;var c12y2=c12.y*c12.y;var c20x2=c20.x*c20.x;var c20y2=c20.y*c20.y;var c21x2=c21.x*c21.x;var c21y2=c21.y*c21.y;var c22x2=c22.x*c22.x;var c22y2=c22.y*c22.y;var c23x2=c23.x*c23.x;var c23y2=c23.y*c23.y;var poly=new Polynomial(-2*c12.x*c12.y*c23.x*c23.y+c12x2*c23y2+c12y2*c23x2,-2*c12.x*c12.y*c22.x*c23.y-2*c12.x*c12.y*c22.y*c23.x+2*c12y2*c22.x*c23.x+2*c12x2*c22.y*c23.y,-2*c12.x*c21.x*c12.y*c23.y-2*c12.x*c12.y*c21.y*c23.x-2*c12.x*c12.y*c22.x*c22.y+2*c21.x*c12y2*c23.x+c12y2*c22x2+c12x2*(2*c21.y*c23.y+c22y2),2*c10.x*c12.x*c12.y*c23.y+2*c10.y*c12.x*c12.y*c23.x+c11.x*c11.y*c12.x*c23.y+c11.x*c11.y*c12.y*c23.x-2*c20.x*c12.x*c12.y*c23.y-2*c12.x*c20.y*c12.y*c23.x-2*c12.x*c21.x*c12.y*c22.y-2*c12.x*c12.y*c21.y*c22.x-2*c10.x*c12y2*c23.x-2*c10.y*c12x2*c23.y+2*c20.x*c12y2*c23.x+2*c21.x*c12y2*c22.x-c11y2*c12.x*c23.x-c11x2*c12.y*c23.y+c12x2*(2*c20.y*c23.y+2*c21.y*c22.y),2*c10.x*c12.x*c12.y*c22.y+2*c10.y*c12.x*c12.y*c22.x+c11.x*c11.y*c12.x*c22.y+c11.x*c11.y*c12.y*c22.x-2*c20.x*c12.x*c12.y*c22.y-2*c12.x*c20.y*c12.y*c22.x-2*c12.x*c21.x*c12.y*c21.y-2*c10.x*c12y2*c22.x-2*c10.y*c12x2*c22.y+2*c20.x*c12y2*c22.x-c11y2*c12.x*c22.x-c11x2*c12.y*c22.y+c21x2*c12y2+c12x2*(2*c20.y*c22.y+c21y2),2*c10.x*c12.x*c12.y*c21.y+2*c10.y*c12.x*c21.x*c12.y+c11.x*c11.y*c12.x*c21.y+c11.x*c11.y*c21.x*c12.y-2*c20.x*c12.x*c12.y*c21.y-2*c12.x*c20.y*c21.x*c12.y-2*c10.x*c21.x*c12y2-2*c10.y*c12x2*c21.y+2*c20.x*c21.x*c12y2-c11y2*c12.x*c21.x-c11x2*c12.y*c21.y+2*c12x2*c20.y*c21.y,-2*c10.x*c10.y*c12.x*c12.y-c10.x*c11.x*c11.y*c12.y-c10.y*c11.x*c11.y*c12.x+2*c10.x*c12.x*c20.y*c12.y+2*c10.y*c20.x*c12.x*c12.y+c11.x*c20.x*c11.y*c12.y+c11.x*c11.y*c12.x*c20.y-2*c20.x*c12.x*c20.y*c12.y-2*c10.x*c20.x*c12y2+c10.x*c11y2*c12.x+c10.y*c11x2*c12.y-2*c10.y*c12x2*c20.y-c20.x*c11y2*c12.x-c11x2*c20.y*c12.y+c10x2*c12y2+c10y2*c12x2+c20x2*c12y2+c12x2*c20y2);var roots=poly.getRootsInInterval(0,1);for(var i=0;i<roots.length;i++){var s=roots[i];var xRoots=new Polynomial(c12.x,c11.x,c10.x-c20.x-s*c21.x-s*s*c22.x-s*s*s*c23.x).getRoots();var yRoots=new Polynomial(c12.y,c11.y,c10.y-c20.y-s*c21.y-s*s*c22.y-s*s*s*c23.y).getRoots();if(xRoots.length>0&&yRoots.length>0){var TOLERANCE=1e-4;checkRoots:for(var j=0;j<xRoots.length;j++){var xRoot=xRoots[j];if(0<=xRoot&&xRoot<=1){for(var k=0;k<yRoots.length;k++){if(Math.abs(xRoot-yRoots[k])<TOLERANCE){result.points.push(c23.multiply(s*s*s).add(c22.multiply(s*s).add(c21.multiply(s).add(c20))));break checkRoots;}}}}}}if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectBezier2Circle=function(p1,p2,p3,c,r){return Intersection.intersectBezier2Ellipse(p1,p2,p3,c,r,r);};
Intersection.intersectBezier2Ellipse=function(p1,p2,p3,ec,rx,ry){var a,b;var c2,c1,c0;var result=new Intersection("No Intersection");a=p2.multiply(-2);c2=p1.add(a.add(p3));a=p1.multiply(-2);b=p2.multiply(2);c1=a.add(b);c0=new Point2D(p1.x,p1.y);var rxrx=rx*rx;var ryry=ry*ry;var roots=new Polynomial(ryry*c2.x*c2.x+rxrx*c2.y*c2.y,2*(ryry*c2.x*c1.x+rxrx*c2.y*c1.y),ryry*(2*c2.x*c0.x+c1.x*c1.x)+rxrx*(2*c2.y*c0.y+c1.y*c1.y)-2*(ryry*ec.x*c2.x+rxrx*ec.y*c2.y),2*(ryry*c1.x*(c0.x-ec.x)+rxrx*c1.y*(c0.y-ec.y)),ryry*(c0.x*c0.x+ec.x*ec.x)+rxrx*(c0.y*c0.y+ec.y*ec.y)-2*(ryry*ec.x*c0.x+rxrx*ec.y*c0.y)-rxrx*ryry).getRoots();for(var i=0;i<roots.length;i++){var t=roots[i];if(0<=t&&t<=1)result.points.push(c2.multiply(t*t).add(c1.multiply(t).add(c0)));}if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectBezier2Line=function(p1,p2,p3,a1,a2){var a,b;var c2,c1,c0;var cl;var n;var min=a1.min(a2);var max=a1.max(a2);var result=new Intersection("No Intersection");a=p2.multiply(-2);c2=p1.add(a.add(p3));a=p1.multiply(-2);b=p2.multiply(2);c1=a.add(b);c0=new Point2D(p1.x,p1.y);n=new Vector2D(a1.y-a2.y,a2.x-a1.x);cl=a1.x*a2.y-a2.x*a1.y;roots=new Polynomial(n.dot(c2),n.dot(c1),n.dot(c0)+cl).getRoots();for(var i=0;i<roots.length;i++){var t=roots[i];if(0<=t&&t<=1){var p4=p1.lerp(p2,t);var p5=p2.lerp(p3,t);var p6=p4.lerp(p5,t);if(a1.x==a2.x){if(min.y<=p6.y&&p6.y<=max.y){result.status="Intersection";result.appendPoint(p6);}}else if(a1.y==a2.y){if(min.x<=p6.x&&p6.x<=max.x){result.status="Intersection";result.appendPoint(p6);}}else if(p6.gte(min)&&p6.lte(max)){result.status="Intersection";result.appendPoint(p6);}}}return result;};
Intersection.intersectBezier2Polygon=function(p1,p2,p3,points){var result=new Intersection("No Intersection");var length=points.length;for(var i=0;i<length;i++){var a1=points[i];var a2=points[(i+1)%length];var inter=Intersection.intersectBezier2Line(p1,p2,p3,a1,a2);result.appendPoints(inter.points);}if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectBezier2Rectangle=function(p1,p2,p3,r1,r2){var min=r1.min(r2);var max=r1.max(r2);var topRight=new Point2D(max.x,min.y);var bottomLeft=new Point2D(min.x,max.y);var inter1=Intersection.intersectBezier2Line(p1,p2,p3,min,topRight);var inter2=Intersection.intersectBezier2Line(p1,p2,p3,topRight,max);var inter3=Intersection.intersectBezier2Line(p1,p2,p3,max,bottomLeft);var inter4=Intersection.intersectBezier2Line(p1,p2,p3,bottomLeft,min);var result=new Intersection("No Intersection");result.appendPoints(inter1.points);result.appendPoints(inter2.points);result.appendPoints(inter3.points);result.appendPoints(inter4.points);if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectBezier3Bezier3=function(a1,a2,a3,a4,b1,b2,b3,b4){var a,b,c,d;var c13,c12,c11,c10;var c23,c22,c21,c20;var result=new Intersection("No Intersection");a=a1.multiply(-1);b=a2.multiply(3);c=a3.multiply(-3);d=a.add(b.add(c.add(a4)));c13=new Vector2D(d.x,d.y);a=a1.multiply(3);b=a2.multiply(-6);c=a3.multiply(3);d=a.add(b.add(c));c12=new Vector2D(d.x,d.y);a=a1.multiply(-3);b=a2.multiply(3);c=a.add(b);c11=new Vector2D(c.x,c.y);c10=new Vector2D(a1.x,a1.y);a=b1.multiply(-1);b=b2.multiply(3);c=b3.multiply(-3);d=a.add(b.add(c.add(b4)));c23=new Vector2D(d.x,d.y);a=b1.multiply(3);b=b2.multiply(-6);c=b3.multiply(3);d=a.add(b.add(c));c22=new Vector2D(d.x,d.y);a=b1.multiply(-3);b=b2.multiply(3);c=a.add(b);c21=new Vector2D(c.x,c.y);c20=new Vector2D(b1.x,b1.y);var c10x2=c10.x*c10.x;var c10x3=c10.x*c10.x*c10.x;var c10y2=c10.y*c10.y;var c10y3=c10.y*c10.y*c10.y;var c11x2=c11.x*c11.x;var c11x3=c11.x*c11.x*c11.x;var c11y2=c11.y*c11.y;var c11y3=c11.y*c11.y*c11.y;var c12x2=c12.x*c12.x;var c12x3=c12.x*c12.x*c12.x;var c12y2=c12.y*c12.y;var c12y3=c12.y*c12.y*c12.y;var c13x2=c13.x*c13.x;var c13x3=c13.x*c13.x*c13.x;var c13y2=c13.y*c13.y;var c13y3=c13.y*c13.y*c13.y;var c20x2=c20.x*c20.x;var c20x3=c20.x*c20.x*c20.x;var c20y2=c20.y*c20.y;var c20y3=c20.y*c20.y*c20.y;var c21x2=c21.x*c21.x;var c21x3=c21.x*c21.x*c21.x;var c21y2=c21.y*c21.y;var c22x2=c22.x*c22.x;var c22x3=c22.x*c22.x*c22.x;var c22y2=c22.y*c22.y;var c23x2=c23.x*c23.x;var c23x3=c23.x*c23.x*c23.x;var c23y2=c23.y*c23.y;var c23y3=c23.y*c23.y*c23.y;var poly=new Polynomial(-c13x3*c23y3+c13y3*c23x3-3*c13.x*c13y2*c23x2*c23.y+3*c13x2*c13.y*c23.x*c23y2,-6*c13.x*c22.x*c13y2*c23.x*c23.y+6*c13x2*c13.y*c22.y*c23.x*c23.y+3*c22.x*c13y3*c23x2-3*c13x3*c22.y*c23y2-3*c13.x*c13y2*c22.y*c23x2+3*c13x2*c22.x*c13.y*c23y2,-6*c21.x*c13.x*c13y2*c23.x*c23.y-6*c13.x*c22.x*c13y2*c22.y*c23.x+6*c13x2*c22.x*c13.y*c22.y*c23.y+3*c21.x*c13y3*c23x2+3*c22x2*c13y3*c23.x+3*c21.x*c13x2*c13.y*c23y2-3*c13.x*c21.y*c13y2*c23x2-3*c13.x*c22x2*c13y2*c23.y+c13x2*c13.y*c23.x*(6*c21.y*c23.y+3*c22y2)+c13x3*(-c21.y*c23y2-2*c22y2*c23.y-c23.y*(2*c21.y*c23.y+c22y2)),c11.x*c12.y*c13.x*c13.y*c23.x*c23.y-c11.y*c12.x*c13.x*c13.y*c23.x*c23.y+6*c21.x*c22.x*c13y3*c23.x+3*c11.x*c12.x*c13.x*c13.y*c23y2+6*c10.x*c13.x*c13y2*c23.x*c23.y-3*c11.x*c12.x*c13y2*c23.x*c23.y-3*c11.y*c12.y*c13.x*c13.y*c23x2-6*c10.y*c13x2*c13.y*c23.x*c23.y-6*c20.x*c13.x*c13y2*c23.x*c23.y+3*c11.y*c12.y*c13x2*c23.x*c23.y-2*c12.x*c12y2*c13.x*c23.x*c23.y-6*c21.x*c13.x*c22.x*c13y2*c23.y-6*c21.x*c13.x*c13y2*c22.y*c23.x-6*c13.x*c21.y*c22.x*c13y2*c23.x+6*c21.x*c13x2*c13.y*c22.y*c23.y+2*c12x2*c12.y*c13.y*c23.x*c23.y+c22x3*c13y3-3*c10.x*c13y3*c23x2+3*c10.y*c13x3*c23y2+3*c20.x*c13y3*c23x2+c12y3*c13.x*c23x2-c12x3*c13.y*c23y2-3*c10.x*c13x2*c13.y*c23y2+3*c10.y*c13.x*c13y2*c23x2-2*c11.x*c12.y*c13x2*c23y2+c11.x*c12.y*c13y2*c23x2-c11.y*c12.x*c13x2*c23y2+2*c11.y*c12.x*c13y2*c23x2+3*c20.x*c13x2*c13.y*c23y2-c12.x*c12y2*c13.y*c23x2-3*c20.y*c13.x*c13y2*c23x2+c12x2*c12.y*c13.x*c23y2-3*c13.x*c22x2*c13y2*c22.y+c13x2*c13.y*c23.x*(6*c20.y*c23.y+6*c21.y*c22.y)+c13x2*c22.x*c13.y*(6*c21.y*c23.y+3*c22y2)+c13x3*(-2*c21.y*c22.y*c23.y-c20.y*c23y2-c22.y*(2*c21.y*c23.y+c22y2)-c23.y*(2*c20.y*c23.y+2*c21.y*c22.y)),6*c11.x*c12.x*c13.x*c13.y*c22.y*c23.y+c11.x*c12.y*c13.x*c22.x*c13.y*c23.y+c11.x*c12.y*c13.x*c13.y*c22.y*c23.x-c11.y*c12.x*c13.x*c22.x*c13.y*c23.y-c11.y*c12.x*c13.x*c13.y*c22.y*c23.x-6*c11.y*c12.y*c13.x*c22.x*c13.y*c23.x-6*c10.x*c22.x*c13y3*c23.x+6*c20.x*c22.x*c13y3*c23.x+6*c10.y*c13x3*c22.y*c23.y+2*c12y3*c13.x*c22.x*c23.x-2*c12x3*c13.y*c22.y*c23.y+6*c10.x*c13.x*c22.x*c13y2*c23.y+6*c10.x*c13.x*c13y2*c22.y*c23.x+6*c10.y*c13.x*c22.x*c13y2*c23.x-3*c11.x*c12.x*c22.x*c13y2*c23.y-3*c11.x*c12.x*c13y2*c22.y*c23.x+2*c11.x*c12.y*c22.x*c13y2*c23.x+4*c11.y*c12.x*c22.x*c13y2*c23.x-6*c10.x*c13x2*c13.y*c22.y*c23.y-6*c10.y*c13x2*c22.x*c13.y*c23.y-6*c10.y*c13x2*c13.y*c22.y*c23.x-4*c11.x*c12.y*c13x2*c22.y*c23.y-6*c20.x*c13.x*c22.x*c13y2*c23.y-6*c20.x*c13.x*c13y2*c22.y*c23.x-2*c11.y*c12.x*c13x2*c22.y*c23.y+3*c11.y*c12.y*c13x2*c22.x*c23.y+3*c11.y*c12.y*c13x2*c22.y*c23.x-2*c12.x*c12y2*c13.x*c22.x*c23.y-2*c12.x*c12y2*c13.x*c22.y*c23.x-2*c12.x*c12y2*c22.x*c13.y*c23.x-6*c20.y*c13.x*c22.x*c13y2*c23.x-6*c21.x*c13.x*c21.y*c13y2*c23.x-6*c21.x*c13.x*c22.x*c13y2*c22.y+6*c20.x*c13x2*c13.y*c22.y*c23.y+2*c12x2*c12.y*c13.x*c22.y*c23.y+2*c12x2*c12.y*c22.x*c13.y*c23.y+2*c12x2*c12.y*c13.y*c22.y*c23.x+3*c21.x*c22x2*c13y3+3*c21x2*c13y3*c23.x-3*c13.x*c21.y*c22x2*c13y2-3*c21x2*c13.x*c13y2*c23.y+c13x2*c22.x*c13.y*(6*c20.y*c23.y+6*c21.y*c22.y)+c13x2*c13.y*c23.x*(6*c20.y*c22.y+3*c21y2)+c21.x*c13x2*c13.y*(6*c21.y*c23.y+3*c22y2)+c13x3*(-2*c20.y*c22.y*c23.y-c23.y*(2*c20.y*c22.y+c21y2)-c21.y*(2*c21.y*c23.y+c22y2)-c22.y*(2*c20.y*c23.y+2*c21.y*c22.y)),c11.x*c21.x*c12.y*c13.x*c13.y*c23.y+c11.x*c12.y*c13.x*c21.y*c13.y*c23.x+c11.x*c12.y*c13.x*c22.x*c13.y*c22.y-c11.y*c12.x*c21.x*c13.x*c13.y*c23.y-c11.y*c12.x*c13.x*c21.y*c13.y*c23.x-c11.y*c12.x*c13.x*c22.x*c13.y*c22.y-6*c11.y*c21.x*c12.y*c13.x*c13.y*c23.x-6*c10.x*c21.x*c13y3*c23.x+6*c20.x*c21.x*c13y3*c23.x+2*c21.x*c12y3*c13.x*c23.x+6*c10.x*c21.x*c13.x*c13y2*c23.y+6*c10.x*c13.x*c21.y*c13y2*c23.x+6*c10.x*c13.x*c22.x*c13y2*c22.y+6*c10.y*c21.x*c13.x*c13y2*c23.x-3*c11.x*c12.x*c21.x*c13y2*c23.y-3*c11.x*c12.x*c21.y*c13y2*c23.x-3*c11.x*c12.x*c22.x*c13y2*c22.y+2*c11.x*c21.x*c12.y*c13y2*c23.x+4*c11.y*c12.x*c21.x*c13y2*c23.x-6*c10.y*c21.x*c13x2*c13.y*c23.y-6*c10.y*c13x2*c21.y*c13.y*c23.x-6*c10.y*c13x2*c22.x*c13.y*c22.y-6*c20.x*c21.x*c13.x*c13y2*c23.y-6*c20.x*c13.x*c21.y*c13y2*c23.x-6*c20.x*c13.x*c22.x*c13y2*c22.y+3*c11.y*c21.x*c12.y*c13x2*c23.y-3*c11.y*c12.y*c13.x*c22x2*c13.y+3*c11.y*c12.y*c13x2*c21.y*c23.x+3*c11.y*c12.y*c13x2*c22.x*c22.y-2*c12.x*c21.x*c12y2*c13.x*c23.y-2*c12.x*c21.x*c12y2*c13.y*c23.x-2*c12.x*c12y2*c13.x*c21.y*c23.x-2*c12.x*c12y2*c13.x*c22.x*c22.y-6*c20.y*c21.x*c13.x*c13y2*c23.x-6*c21.x*c13.x*c21.y*c22.x*c13y2+6*c20.y*c13x2*c21.y*c13.y*c23.x+2*c12x2*c21.x*c12.y*c13.y*c23.y+2*c12x2*c12.y*c21.y*c13.y*c23.x+2*c12x2*c12.y*c22.x*c13.y*c22.y-3*c10.x*c22x2*c13y3+3*c20.x*c22x2*c13y3+3*c21x2*c22.x*c13y3+c12y3*c13.x*c22x2+3*c10.y*c13.x*c22x2*c13y2+c11.x*c12.y*c22x2*c13y2+2*c11.y*c12.x*c22x2*c13y2-c12.x*c12y2*c22x2*c13.y-3*c20.y*c13.x*c22x2*c13y2-3*c21x2*c13.x*c13y2*c22.y+c12x2*c12.y*c13.x*(2*c21.y*c23.y+c22y2)+c11.x*c12.x*c13.x*c13.y*(6*c21.y*c23.y+3*c22y2)+c21.x*c13x2*c13.y*(6*c20.y*c23.y+6*c21.y*c22.y)+c12x3*c13.y*(-2*c21.y*c23.y-c22y2)+c10.y*c13x3*(6*c21.y*c23.y+3*c22y2)+c11.y*c12.x*c13x2*(-2*c21.y*c23.y-c22y2)+c11.x*c12.y*c13x2*(-4*c21.y*c23.y-2*c22y2)+c10.x*c13x2*c13.y*(-6*c21.y*c23.y-3*c22y2)+c13x2*c22.x*c13.y*(6*c20.y*c22.y+3*c21y2)+c20.x*c13x2*c13.y*(6*c21.y*c23.y+3*c22y2)+c13x3*(-2*c20.y*c21.y*c23.y-c22.y*(2*c20.y*c22.y+c21y2)-c20.y*(2*c21.y*c23.y+c22y2)-c21.y*(2*c20.y*c23.y+2*c21.y*c22.y)),-c10.x*c11.x*c12.y*c13.x*c13.y*c23.y+c10.x*c11.y*c12.x*c13.x*c13.y*c23.y+6*c10.x*c11.y*c12.y*c13.x*c13.y*c23.x-6*c10.y*c11.x*c12.x*c13.x*c13.y*c23.y-c10.y*c11.x*c12.y*c13.x*c13.y*c23.x+c10.y*c11.y*c12.x*c13.x*c13.y*c23.x+c11.x*c11.y*c12.x*c12.y*c13.x*c23.y-c11.x*c11.y*c12.x*c12.y*c13.y*c23.x+c11.x*c20.x*c12.y*c13.x*c13.y*c23.y+c11.x*c20.y*c12.y*c13.x*c13.y*c23.x+c11.x*c21.x*c12.y*c13.x*c13.y*c22.y+c11.x*c12.y*c13.x*c21.y*c22.x*c13.y-c20.x*c11.y*c12.x*c13.x*c13.y*c23.y-6*c20.x*c11.y*c12.y*c13.x*c13.y*c23.x-c11.y*c12.x*c20.y*c13.x*c13.y*c23.x-c11.y*c12.x*c21.x*c13.x*c13.y*c22.y-c11.y*c12.x*c13.x*c21.y*c22.x*c13.y-6*c11.y*c21.x*c12.y*c13.x*c22.x*c13.y-6*c10.x*c20.x*c13y3*c23.x-6*c10.x*c21.x*c22.x*c13y3-2*c10.x*c12y3*c13.x*c23.x+6*c20.x*c21.x*c22.x*c13y3+2*c20.x*c12y3*c13.x*c23.x+2*c21.x*c12y3*c13.x*c22.x+2*c10.y*c12x3*c13.y*c23.y-6*c10.x*c10.y*c13.x*c13y2*c23.x+3*c10.x*c11.x*c12.x*c13y2*c23.y-2*c10.x*c11.x*c12.y*c13y2*c23.x-4*c10.x*c11.y*c12.x*c13y2*c23.x+3*c10.y*c11.x*c12.x*c13y2*c23.x+6*c10.x*c10.y*c13x2*c13.y*c23.y+6*c10.x*c20.x*c13.x*c13y2*c23.y-3*c10.x*c11.y*c12.y*c13x2*c23.y+2*c10.x*c12.x*c12y2*c13.x*c23.y+2*c10.x*c12.x*c12y2*c13.y*c23.x+6*c10.x*c20.y*c13.x*c13y2*c23.x+6*c10.x*c21.x*c13.x*c13y2*c22.y+6*c10.x*c13.x*c21.y*c22.x*c13y2+4*c10.y*c11.x*c12.y*c13x2*c23.y+6*c10.y*c20.x*c13.x*c13y2*c23.x+2*c10.y*c11.y*c12.x*c13x2*c23.y-3*c10.y*c11.y*c12.y*c13x2*c23.x+2*c10.y*c12.x*c12y2*c13.x*c23.x+6*c10.y*c21.x*c13.x*c22.x*c13y2-3*c11.x*c20.x*c12.x*c13y2*c23.y+2*c11.x*c20.x*c12.y*c13y2*c23.x+c11.x*c11.y*c12y2*c13.x*c23.x-3*c11.x*c12.x*c20.y*c13y2*c23.x-3*c11.x*c12.x*c21.x*c13y2*c22.y-3*c11.x*c12.x*c21.y*c22.x*c13y2+2*c11.x*c21.x*c12.y*c22.x*c13y2+4*c20.x*c11.y*c12.x*c13y2*c23.x+4*c11.y*c12.x*c21.x*c22.x*c13y2-2*c10.x*c12x2*c12.y*c13.y*c23.y-6*c10.y*c20.x*c13x2*c13.y*c23.y-6*c10.y*c20.y*c13x2*c13.y*c23.x-6*c10.y*c21.x*c13x2*c13.y*c22.y-2*c10.y*c12x2*c12.y*c13.x*c23.y-2*c10.y*c12x2*c12.y*c13.y*c23.x-6*c10.y*c13x2*c21.y*c22.x*c13.y-c11.x*c11.y*c12x2*c13.y*c23.y-2*c11.x*c11y2*c13.x*c13.y*c23.x+3*c20.x*c11.y*c12.y*c13x2*c23.y-2*c20.x*c12.x*c12y2*c13.x*c23.y-2*c20.x*c12.x*c12y2*c13.y*c23.x-6*c20.x*c20.y*c13.x*c13y2*c23.x-6*c20.x*c21.x*c13.x*c13y2*c22.y-6*c20.x*c13.x*c21.y*c22.x*c13y2+3*c11.y*c20.y*c12.y*c13x2*c23.x+3*c11.y*c21.x*c12.y*c13x2*c22.y+3*c11.y*c12.y*c13x2*c21.y*c22.x-2*c12.x*c20.y*c12y2*c13.x*c23.x-2*c12.x*c21.x*c12y2*c13.x*c22.y-2*c12.x*c21.x*c12y2*c22.x*c13.y-2*c12.x*c12y2*c13.x*c21.y*c22.x-6*c20.y*c21.x*c13.x*c22.x*c13y2-c11y2*c12.x*c12.y*c13.x*c23.x+2*c20.x*c12x2*c12.y*c13.y*c23.y+6*c20.y*c13x2*c21.y*c22.x*c13.y+2*c11x2*c11.y*c13.x*c13.y*c23.y+c11x2*c12.x*c12.y*c13.y*c23.y+2*c12x2*c20.y*c12.y*c13.y*c23.x+2*c12x2*c21.x*c12.y*c13.y*c22.y+2*c12x2*c12.y*c21.y*c22.x*c13.y+c21x3*c13y3+3*c10x2*c13y3*c23.x-3*c10y2*c13x3*c23.y+3*c20x2*c13y3*c23.x+c11y3*c13x2*c23.x-c11x3*c13y2*c23.y-c11.x*c11y2*c13x2*c23.y+c11x2*c11.y*c13y2*c23.x-3*c10x2*c13.x*c13y2*c23.y+3*c10y2*c13x2*c13.y*c23.x-c11x2*c12y2*c13.x*c23.y+c11y2*c12x2*c13.y*c23.x-3*c21x2*c13.x*c21.y*c13y2-3*c20x2*c13.x*c13y2*c23.y+3*c20y2*c13x2*c13.y*c23.x+c11.x*c12.x*c13.x*c13.y*(6*c20.y*c23.y+6*c21.y*c22.y)+c12x3*c13.y*(-2*c20.y*c23.y-2*c21.y*c22.y)+c10.y*c13x3*(6*c20.y*c23.y+6*c21.y*c22.y)+c11.y*c12.x*c13x2*(-2*c20.y*c23.y-2*c21.y*c22.y)+c12x2*c12.y*c13.x*(2*c20.y*c23.y+2*c21.y*c22.y)+c11.x*c12.y*c13x2*(-4*c20.y*c23.y-4*c21.y*c22.y)+c10.x*c13x2*c13.y*(-6*c20.y*c23.y-6*c21.y*c22.y)+c20.x*c13x2*c13.y*(6*c20.y*c23.y+6*c21.y*c22.y)+c21.x*c13x2*c13.y*(6*c20.y*c22.y+3*c21y2)+c13x3*(-2*c20.y*c21.y*c22.y-c20y2*c23.y-c21.y*(2*c20.y*c22.y+c21y2)-c20.y*(2*c20.y*c23.y+2*c21.y*c22.y)),-c10.x*c11.x*c12.y*c13.x*c13.y*c22.y+c10.x*c11.y*c12.x*c13.x*c13.y*c22.y+6*c10.x*c11.y*c12.y*c13.x*c22.x*c13.y-6*c10.y*c11.x*c12.x*c13.x*c13.y*c22.y-c10.y*c11.x*c12.y*c13.x*c22.x*c13.y+c10.y*c11.y*c12.x*c13.x*c22.x*c13.y+c11.x*c11.y*c12.x*c12.y*c13.x*c22.y-c11.x*c11.y*c12.x*c12.y*c22.x*c13.y+c11.x*c20.x*c12.y*c13.x*c13.y*c22.y+c11.x*c20.y*c12.y*c13.x*c22.x*c13.y+c11.x*c21.x*c12.y*c13.x*c21.y*c13.y-c20.x*c11.y*c12.x*c13.x*c13.y*c22.y-6*c20.x*c11.y*c12.y*c13.x*c22.x*c13.y-c11.y*c12.x*c20.y*c13.x*c22.x*c13.y-c11.y*c12.x*c21.x*c13.x*c21.y*c13.y-6*c10.x*c20.x*c22.x*c13y3-2*c10.x*c12y3*c13.x*c22.x+2*c20.x*c12y3*c13.x*c22.x+2*c10.y*c12x3*c13.y*c22.y-6*c10.x*c10.y*c13.x*c22.x*c13y2+3*c10.x*c11.x*c12.x*c13y2*c22.y-2*c10.x*c11.x*c12.y*c22.x*c13y2-4*c10.x*c11.y*c12.x*c22.x*c13y2+3*c10.y*c11.x*c12.x*c22.x*c13y2+6*c10.x*c10.y*c13x2*c13.y*c22.y+6*c10.x*c20.x*c13.x*c13y2*c22.y-3*c10.x*c11.y*c12.y*c13x2*c22.y+2*c10.x*c12.x*c12y2*c13.x*c22.y+2*c10.x*c12.x*c12y2*c22.x*c13.y+6*c10.x*c20.y*c13.x*c22.x*c13y2+6*c10.x*c21.x*c13.x*c21.y*c13y2+4*c10.y*c11.x*c12.y*c13x2*c22.y+6*c10.y*c20.x*c13.x*c22.x*c13y2+2*c10.y*c11.y*c12.x*c13x2*c22.y-3*c10.y*c11.y*c12.y*c13x2*c22.x+2*c10.y*c12.x*c12y2*c13.x*c22.x-3*c11.x*c20.x*c12.x*c13y2*c22.y+2*c11.x*c20.x*c12.y*c22.x*c13y2+c11.x*c11.y*c12y2*c13.x*c22.x-3*c11.x*c12.x*c20.y*c22.x*c13y2-3*c11.x*c12.x*c21.x*c21.y*c13y2+4*c20.x*c11.y*c12.x*c22.x*c13y2-2*c10.x*c12x2*c12.y*c13.y*c22.y-6*c10.y*c20.x*c13x2*c13.y*c22.y-6*c10.y*c20.y*c13x2*c22.x*c13.y-6*c10.y*c21.x*c13x2*c21.y*c13.y-2*c10.y*c12x2*c12.y*c13.x*c22.y-2*c10.y*c12x2*c12.y*c22.x*c13.y-c11.x*c11.y*c12x2*c13.y*c22.y-2*c11.x*c11y2*c13.x*c22.x*c13.y+3*c20.x*c11.y*c12.y*c13x2*c22.y-2*c20.x*c12.x*c12y2*c13.x*c22.y-2*c20.x*c12.x*c12y2*c22.x*c13.y-6*c20.x*c20.y*c13.x*c22.x*c13y2-6*c20.x*c21.x*c13.x*c21.y*c13y2+3*c11.y*c20.y*c12.y*c13x2*c22.x+3*c11.y*c21.x*c12.y*c13x2*c21.y-2*c12.x*c20.y*c12y2*c13.x*c22.x-2*c12.x*c21.x*c12y2*c13.x*c21.y-c11y2*c12.x*c12.y*c13.x*c22.x+2*c20.x*c12x2*c12.y*c13.y*c22.y-3*c11.y*c21x2*c12.y*c13.x*c13.y+6*c20.y*c21.x*c13x2*c21.y*c13.y+2*c11x2*c11.y*c13.x*c13.y*c22.y+c11x2*c12.x*c12.y*c13.y*c22.y+2*c12x2*c20.y*c12.y*c22.x*c13.y+2*c12x2*c21.x*c12.y*c21.y*c13.y-3*c10.x*c21x2*c13y3+3*c20.x*c21x2*c13y3+3*c10x2*c22.x*c13y3-3*c10y2*c13x3*c22.y+3*c20x2*c22.x*c13y3+c21x2*c12y3*c13.x+c11y3*c13x2*c22.x-c11x3*c13y2*c22.y+3*c10.y*c21x2*c13.x*c13y2-c11.x*c11y2*c13x2*c22.y+c11.x*c21x2*c12.y*c13y2+2*c11.y*c12.x*c21x2*c13y2+c11x2*c11.y*c22.x*c13y2-c12.x*c21x2*c12y2*c13.y-3*c20.y*c21x2*c13.x*c13y2-3*c10x2*c13.x*c13y2*c22.y+3*c10y2*c13x2*c22.x*c13.y-c11x2*c12y2*c13.x*c22.y+c11y2*c12x2*c22.x*c13.y-3*c20x2*c13.x*c13y2*c22.y+3*c20y2*c13x2*c22.x*c13.y+c12x2*c12.y*c13.x*(2*c20.y*c22.y+c21y2)+c11.x*c12.x*c13.x*c13.y*(6*c20.y*c22.y+3*c21y2)+c12x3*c13.y*(-2*c20.y*c22.y-c21y2)+c10.y*c13x3*(6*c20.y*c22.y+3*c21y2)+c11.y*c12.x*c13x2*(-2*c20.y*c22.y-c21y2)+c11.x*c12.y*c13x2*(-4*c20.y*c22.y-2*c21y2)+c10.x*c13x2*c13.y*(-6*c20.y*c22.y-3*c21y2)+c20.x*c13x2*c13.y*(6*c20.y*c22.y+3*c21y2)+c13x3*(-2*c20.y*c21y2-c20y2*c22.y-c20.y*(2*c20.y*c22.y+c21y2)),-c10.x*c11.x*c12.y*c13.x*c21.y*c13.y+c10.x*c11.y*c12.x*c13.x*c21.y*c13.y+6*c10.x*c11.y*c21.x*c12.y*c13.x*c13.y-6*c10.y*c11.x*c12.x*c13.x*c21.y*c13.y-c10.y*c11.x*c21.x*c12.y*c13.x*c13.y+c10.y*c11.y*c12.x*c21.x*c13.x*c13.y-c11.x*c11.y*c12.x*c21.x*c12.y*c13.y+c11.x*c11.y*c12.x*c12.y*c13.x*c21.y+c11.x*c20.x*c12.y*c13.x*c21.y*c13.y+6*c11.x*c12.x*c20.y*c13.x*c21.y*c13.y+c11.x*c20.y*c21.x*c12.y*c13.x*c13.y-c20.x*c11.y*c12.x*c13.x*c21.y*c13.y-6*c20.x*c11.y*c21.x*c12.y*c13.x*c13.y-c11.y*c12.x*c20.y*c21.x*c13.x*c13.y-6*c10.x*c20.x*c21.x*c13y3-2*c10.x*c21.x*c12y3*c13.x+6*c10.y*c20.y*c13x3*c21.y+2*c20.x*c21.x*c12y3*c13.x+2*c10.y*c12x3*c21.y*c13.y-2*c12x3*c20.y*c21.y*c13.y-6*c10.x*c10.y*c21.x*c13.x*c13y2+3*c10.x*c11.x*c12.x*c21.y*c13y2-2*c10.x*c11.x*c21.x*c12.y*c13y2-4*c10.x*c11.y*c12.x*c21.x*c13y2+3*c10.y*c11.x*c12.x*c21.x*c13y2+6*c10.x*c10.y*c13x2*c21.y*c13.y+6*c10.x*c20.x*c13.x*c21.y*c13y2-3*c10.x*c11.y*c12.y*c13x2*c21.y+2*c10.x*c12.x*c21.x*c12y2*c13.y+2*c10.x*c12.x*c12y2*c13.x*c21.y+6*c10.x*c20.y*c21.x*c13.x*c13y2+4*c10.y*c11.x*c12.y*c13x2*c21.y+6*c10.y*c20.x*c21.x*c13.x*c13y2+2*c10.y*c11.y*c12.x*c13x2*c21.y-3*c10.y*c11.y*c21.x*c12.y*c13x2+2*c10.y*c12.x*c21.x*c12y2*c13.x-3*c11.x*c20.x*c12.x*c21.y*c13y2+2*c11.x*c20.x*c21.x*c12.y*c13y2+c11.x*c11.y*c21.x*c12y2*c13.x-3*c11.x*c12.x*c20.y*c21.x*c13y2+4*c20.x*c11.y*c12.x*c21.x*c13y2-6*c10.x*c20.y*c13x2*c21.y*c13.y-2*c10.x*c12x2*c12.y*c21.y*c13.y-6*c10.y*c20.x*c13x2*c21.y*c13.y-6*c10.y*c20.y*c21.x*c13x2*c13.y-2*c10.y*c12x2*c21.x*c12.y*c13.y-2*c10.y*c12x2*c12.y*c13.x*c21.y-c11.x*c11.y*c12x2*c21.y*c13.y-4*c11.x*c20.y*c12.y*c13x2*c21.y-2*c11.x*c11y2*c21.x*c13.x*c13.y+3*c20.x*c11.y*c12.y*c13x2*c21.y-2*c20.x*c12.x*c21.x*c12y2*c13.y-2*c20.x*c12.x*c12y2*c13.x*c21.y-6*c20.x*c20.y*c21.x*c13.x*c13y2-2*c11.y*c12.x*c20.y*c13x2*c21.y+3*c11.y*c20.y*c21.x*c12.y*c13x2-2*c12.x*c20.y*c21.x*c12y2*c13.x-c11y2*c12.x*c21.x*c12.y*c13.x+6*c20.x*c20.y*c13x2*c21.y*c13.y+2*c20.x*c12x2*c12.y*c21.y*c13.y+2*c11x2*c11.y*c13.x*c21.y*c13.y+c11x2*c12.x*c12.y*c21.y*c13.y+2*c12x2*c20.y*c21.x*c12.y*c13.y+2*c12x2*c20.y*c12.y*c13.x*c21.y+3*c10x2*c21.x*c13y3-3*c10y2*c13x3*c21.y+3*c20x2*c21.x*c13y3+c11y3*c21.x*c13x2-c11x3*c21.y*c13y2-3*c20y2*c13x3*c21.y-c11.x*c11y2*c13x2*c21.y+c11x2*c11.y*c21.x*c13y2-3*c10x2*c13.x*c21.y*c13y2+3*c10y2*c21.x*c13x2*c13.y-c11x2*c12y2*c13.x*c21.y+c11y2*c12x2*c21.x*c13.y-3*c20x2*c13.x*c21.y*c13y2+3*c20y2*c21.x*c13x2*c13.y,c10.x*c10.y*c11.x*c12.y*c13.x*c13.y-c10.x*c10.y*c11.y*c12.x*c13.x*c13.y+c10.x*c11.x*c11.y*c12.x*c12.y*c13.y-c10.y*c11.x*c11.y*c12.x*c12.y*c13.x-c10.x*c11.x*c20.y*c12.y*c13.x*c13.y+6*c10.x*c20.x*c11.y*c12.y*c13.x*c13.y+c10.x*c11.y*c12.x*c20.y*c13.x*c13.y-c10.y*c11.x*c20.x*c12.y*c13.x*c13.y-6*c10.y*c11.x*c12.x*c20.y*c13.x*c13.y+c10.y*c20.x*c11.y*c12.x*c13.x*c13.y-c11.x*c20.x*c11.y*c12.x*c12.y*c13.y+c11.x*c11.y*c12.x*c20.y*c12.y*c13.x+c11.x*c20.x*c20.y*c12.y*c13.x*c13.y-c20.x*c11.y*c12.x*c20.y*c13.x*c13.y-2*c10.x*c20.x*c12y3*c13.x+2*c10.y*c12x3*c20.y*c13.y-3*c10.x*c10.y*c11.x*c12.x*c13y2-6*c10.x*c10.y*c20.x*c13.x*c13y2+3*c10.x*c10.y*c11.y*c12.y*c13x2-2*c10.x*c10.y*c12.x*c12y2*c13.x-2*c10.x*c11.x*c20.x*c12.y*c13y2-c10.x*c11.x*c11.y*c12y2*c13.x+3*c10.x*c11.x*c12.x*c20.y*c13y2-4*c10.x*c20.x*c11.y*c12.x*c13y2+3*c10.y*c11.x*c20.x*c12.x*c13y2+6*c10.x*c10.y*c20.y*c13x2*c13.y+2*c10.x*c10.y*c12x2*c12.y*c13.y+2*c10.x*c11.x*c11y2*c13.x*c13.y+2*c10.x*c20.x*c12.x*c12y2*c13.y+6*c10.x*c20.x*c20.y*c13.x*c13y2-3*c10.x*c11.y*c20.y*c12.y*c13x2+2*c10.x*c12.x*c20.y*c12y2*c13.x+c10.x*c11y2*c12.x*c12.y*c13.x+c10.y*c11.x*c11.y*c12x2*c13.y+4*c10.y*c11.x*c20.y*c12.y*c13x2-3*c10.y*c20.x*c11.y*c12.y*c13x2+2*c10.y*c20.x*c12.x*c12y2*c13.x+2*c10.y*c11.y*c12.x*c20.y*c13x2+c11.x*c20.x*c11.y*c12y2*c13.x-3*c11.x*c20.x*c12.x*c20.y*c13y2-2*c10.x*c12x2*c20.y*c12.y*c13.y-6*c10.y*c20.x*c20.y*c13x2*c13.y-2*c10.y*c20.x*c12x2*c12.y*c13.y-2*c10.y*c11x2*c11.y*c13.x*c13.y-c10.y*c11x2*c12.x*c12.y*c13.y-2*c10.y*c12x2*c20.y*c12.y*c13.x-2*c11.x*c20.x*c11y2*c13.x*c13.y-c11.x*c11.y*c12x2*c20.y*c13.y+3*c20.x*c11.y*c20.y*c12.y*c13x2-2*c20.x*c12.x*c20.y*c12y2*c13.x-c20.x*c11y2*c12.x*c12.y*c13.x+3*c10y2*c11.x*c12.x*c13.x*c13.y+3*c11.x*c12.x*c20y2*c13.x*c13.y+2*c20.x*c12x2*c20.y*c12.y*c13.y-3*c10x2*c11.y*c12.y*c13.x*c13.y+2*c11x2*c11.y*c20.y*c13.x*c13.y+c11x2*c12.x*c20.y*c12.y*c13.y-3*c20x2*c11.y*c12.y*c13.x*c13.y-c10x3*c13y3+c10y3*c13x3+c20x3*c13y3-c20y3*c13x3-3*c10.x*c20x2*c13y3-c10.x*c11y3*c13x2+3*c10x2*c20.x*c13y3+c10.y*c11x3*c13y2+3*c10.y*c20y2*c13x3+c20.x*c11y3*c13x2+c10x2*c12y3*c13.x-3*c10y2*c20.y*c13x3-c10y2*c12x3*c13.y+c20x2*c12y3*c13.x-c11x3*c20.y*c13y2-c12x3*c20y2*c13.y-c10.x*c11x2*c11.y*c13y2+c10.y*c11.x*c11y2*c13x2-3*c10.x*c10y2*c13x2*c13.y-c10.x*c11y2*c12x2*c13.y+c10.y*c11x2*c12y2*c13.x-c11.x*c11y2*c20.y*c13x2+3*c10x2*c10.y*c13.x*c13y2+c10x2*c11.x*c12.y*c13y2+2*c10x2*c11.y*c12.x*c13y2-2*c10y2*c11.x*c12.y*c13x2-c10y2*c11.y*c12.x*c13x2+c11x2*c20.x*c11.y*c13y2-3*c10.x*c20y2*c13x2*c13.y+3*c10.y*c20x2*c13.x*c13y2+c11.x*c20x2*c12.y*c13y2-2*c11.x*c20y2*c12.y*c13x2+c20.x*c11y2*c12x2*c13.y-c11.y*c12.x*c20y2*c13x2-c10x2*c12.x*c12y2*c13.y-3*c10x2*c20.y*c13.x*c13y2+3*c10y2*c20.x*c13x2*c13.y+c10y2*c12x2*c12.y*c13.x-c11x2*c20.y*c12y2*c13.x+2*c20x2*c11.y*c12.x*c13y2+3*c20.x*c20y2*c13x2*c13.y-c20x2*c12.x*c12y2*c13.y-3*c20x2*c20.y*c13.x*c13y2+c12x2*c20y2*c12.y*c13.x);var roots=poly.getRootsInInterval(0,1);for(var i=0;i<roots.length;i++){var s=roots[i];var xRoots=new Polynomial(c13.x,c12.x,c11.x,c10.x-c20.x-s*c21.x-s*s*c22.x-s*s*s*c23.x).getRoots();var yRoots=new Polynomial(c13.y,c12.y,c11.y,c10.y-c20.y-s*c21.y-s*s*c22.y-s*s*s*c23.y).getRoots();if(xRoots.length>0&&yRoots.length>0){var TOLERANCE=1e-4;checkRoots:for(var j=0;j<xRoots.length;j++){var xRoot=xRoots[j];if(0<=xRoot&&xRoot<=1){for(var k=0;k<yRoots.length;k++){if(Math.abs(xRoot-yRoots[k])<TOLERANCE){result.points.push(c23.multiply(s*s*s).add(c22.multiply(s*s).add(c21.multiply(s).add(c20))));break checkRoots;}}}}}}if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectBezier3Circle=function(p1,p2,p3,p4,c,r){return Intersection.intersectBezier3Ellipse(p1,p2,p3,p4,c,r,r);};
Intersection.intersectBezier3Ellipse=function(p1,p2,p3,p4,ec,rx,ry){var a,b,c,d;var c3,c2,c1,c0;var result=new Intersection("No Intersection");a=p1.multiply(-1);b=p2.multiply(3);c=p3.multiply(-3);d=a.add(b.add(c.add(p4)));c3=new Vector2D(d.x,d.y);a=p1.multiply(3);b=p2.multiply(-6);c=p3.multiply(3);d=a.add(b.add(c));c2=new Vector2D(d.x,d.y);a=p1.multiply(-3);b=p2.multiply(3);c=a.add(b);c1=new Vector2D(c.x,c.y);c0=new Vector2D(p1.x,p1.y);var rxrx=rx*rx;var ryry=ry*ry;var poly=new Polynomial(c3.x*c3.x*ryry+c3.y*c3.y*rxrx,2*(c3.x*c2.x*ryry+c3.y*c2.y*rxrx),2*(c3.x*c1.x*ryry+c3.y*c1.y*rxrx)+c2.x*c2.x*ryry+c2.y*c2.y*rxrx,2*c3.x*ryry*(c0.x-ec.x)+2*c3.y*rxrx*(c0.y-ec.y)+2*(c2.x*c1.x*ryry+c2.y*c1.y*rxrx),2*c2.x*ryry*(c0.x-ec.x)+2*c2.y*rxrx*(c0.y-ec.y)+c1.x*c1.x*ryry+c1.y*c1.y*rxrx,2*c1.x*ryry*(c0.x-ec.x)+2*c1.y*rxrx*(c0.y-ec.y),c0.x*c0.x*ryry-2*c0.y*ec.y*rxrx-2*c0.x*ec.x*ryry+c0.y*c0.y*rxrx+ec.x*ec.x*ryry+ec.y*ec.y*rxrx-rxrx*ryry);var roots=poly.getRootsInInterval(0,1);for(var i=0;i<roots.length;i++){var t=roots[i];result.points.push(c3.multiply(t*t*t).add(c2.multiply(t*t).add(c1.multiply(t).add(c0))));}if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectBezier3Line=function(p1,p2,p3,p4,a1,a2){var a,b,c,d;var c3,c2,c1,c0;var cl;var n;var min=a1.min(a2);var max=a1.max(a2);var result=new Intersection("No Intersection");a=p1.multiply(-1);b=p2.multiply(3);c=p3.multiply(-3);d=a.add(b.add(c.add(p4)));c3=new Vector2D(d.x,d.y);a=p1.multiply(3);b=p2.multiply(-6);c=p3.multiply(3);d=a.add(b.add(c));c2=new Vector2D(d.x,d.y);a=p1.multiply(-3);b=p2.multiply(3);c=a.add(b);c1=new Vector2D(c.x,c.y);c0=new Vector2D(p1.x,p1.y);n=new Vector2D(a1.y-a2.y,a2.x-a1.x);cl=a1.x*a2.y-a2.x*a1.y;roots=new Polynomial(n.dot(c3),n.dot(c2),n.dot(c1),n.dot(c0)+cl).getRoots();for(var i=0;i<roots.length;i++){var t=roots[i];if(0<=t&&t<=1){var p5=p1.lerp(p2,t);var p6=p2.lerp(p3,t);var p7=p3.lerp(p4,t);var p8=p5.lerp(p6,t);var p9=p6.lerp(p7,t);var p10=p8.lerp(p9,t);if(a1.x==a2.x){if(min.y<=p10.y&&p10.y<=max.y){result.status="Intersection";result.appendPoint(p10);}}else if(a1.y==a2.y){if(min.x<=p10.x&&p10.x<=max.x){result.status="Intersection";result.appendPoint(p10);}}else if(p10.gte(min)&&p10.lte(max)){result.status="Intersection";result.appendPoint(p10);}}}return result;};
Intersection.intersectBezier3Polygon=function(p1,p2,p3,p4,points){var result=new Intersection("No Intersection");var length=points.length;for(var i=0;i<length;i++){var a1=points[i];var a2=points[(i+1)%length];var inter=Intersection.intersectBezier3Line(p1,p2,p3,p4,a1,a2);result.appendPoints(inter.points);}if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectBezier3Rectangle=function(p1,p2,p3,p4,r1,r2){var min=r1.min(r2);var max=r1.max(r2);var topRight=new Point2D(max.x,min.y);var bottomLeft=new Point2D(min.x,max.y);var inter1=Intersection.intersectBezier3Line(p1,p2,p3,p4,min,topRight);var inter2=Intersection.intersectBezier3Line(p1,p2,p3,p4,topRight,max);var inter3=Intersection.intersectBezier3Line(p1,p2,p3,p4,max,bottomLeft);var inter4=Intersection.intersectBezier3Line(p1,p2,p3,p4,bottomLeft,min);var result=new Intersection("No Intersection");result.appendPoints(inter1.points);result.appendPoints(inter2.points);result.appendPoints(inter3.points);result.appendPoints(inter4.points);if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectCircleCircle=function(c1,r1,c2,r2){var result;var r_max=r1+r2;var r_min=Math.abs(r1-r2);var c_dist=c1.distanceFrom(c2);if(c_dist>r_max){result=new Intersection("Outside");}else if(c_dist<r_min){result=new Intersection("Inside");}else{result=new Intersection("Intersection");var a=(r1*r1-r2*r2+c_dist*c_dist)/(2*c_dist);var h=Math.sqrt(r1*r1-a*a);var p=c1.lerp(c2,a/c_dist);var b=h/c_dist;result.points.push(new Point2D(p.x-b*(c2.y-c1.y),p.y+b*(c2.x-c1.x)));result.points.push(new Point2D(p.x+b*(c2.y-c1.y),p.y-b*(c2.x-c1.x)));}return result;};
Intersection.intersectCircleEllipse=function(cc,r,ec,rx,ry){return Intersection.intersectEllipseEllipse(cc,r,r,ec,rx,ry);};
Intersection.intersectCircleLine=function(c,r,a1,a2){var result;var a=(a2.x-a1.x)*(a2.x-a1.x)+(a2.y-a1.y)*(a2.y-a1.y);var b=2*((a2.x-a1.x)*(a1.x-c.x)+(a2.y-a1.y)*(a1.y-c.y));var cc=c.x*c.x+c.y*c.y+a1.x*a1.x+a1.y*a1.y-2*(c.x*a1.x+c.y*a1.y)-r*r;var deter=b*b-4*a*cc;if(deter<0){result=new Intersection("Outside");}else if(deter==0){result=new Intersection("Tangent");}else{var e=Math.sqrt(deter);var u1=(-b+e)/(2*a);var u2=(-b-e)/(2*a);if((u1<0||u1>1)&&(u2<0||u2>1)){if((u1<0&&u2<0)||(u1>1&&u2>1)){result=new Intersection("Outside");}else{result=new Intersection("Inside");}}else{result=new Intersection("Intersection");if(0<=u1&&u1<=1)result.points.push(a1.lerp(a2,u1));if(0<=u2&&u2<=1)result.points.push(a1.lerp(a2,u2));}}return result;};
Intersection.intersectCirclePolygon=function(c,r,points){var result=new Intersection("No Intersection");var length=points.length;var inter;for(var i=0;i<length;i++){var a1=points[i];var a2=points[(i+1)%length];inter=Intersection.intersectCircleLine(c,r,a1,a2);result.appendPoints(inter.points);}if(result.points.length>0)result.status="Intersection";else result.status=inter.status;return result;};
Intersection.intersectCircleRectangle=function(c,r,r1,r2){var min=r1.min(r2);var max=r1.max(r2);var topRight=new Point2D(max.x,min.y);var bottomLeft=new Point2D(min.x,max.y);var inter1=Intersection.intersectCircleLine(c,r,min,topRight);var inter2=Intersection.intersectCircleLine(c,r,topRight,max);var inter3=Intersection.intersectCircleLine(c,r,max,bottomLeft);var inter4=Intersection.intersectCircleLine(c,r,bottomLeft,min);var result=new Intersection("No Intersection");result.appendPoints(inter1.points);result.appendPoints(inter2.points);result.appendPoints(inter3.points);result.appendPoints(inter4.points);if(result.points.length>0)result.status="Intersection";else result.status=inter1.status;return result;};
Intersection.intersectEllipseEllipse=function(c1,rx1,ry1,c2,rx2,ry2){var a=[ry1*ry1,0,rx1*rx1,-2*ry1*ry1*c1.x,-2*rx1*rx1*c1.y,ry1*ry1*c1.x*c1.x+rx1*rx1*c1.y*c1.y-rx1*rx1*ry1*ry1];var b=[ry2*ry2,0,rx2*rx2,-2*ry2*ry2*c2.x,-2*rx2*rx2*c2.y,ry2*ry2*c2.x*c2.x+rx2*rx2*c2.y*c2.y-rx2*rx2*ry2*ry2];var yPoly=Intersection.bezout(a,b);var yRoots=yPoly.getRoots();var epsilon=1e-3;var norm0=(a[0]*a[0]+2*a[1]*a[1]+a[2]*a[2])*epsilon;var norm1=(b[0]*b[0]+2*b[1]*b[1]+b[2]*b[2])*epsilon;var result=new Intersection("No Intersection");for(var y=0;y<yRoots.length;y++){var xPoly=new Polynomial(a[0],a[3]+yRoots[y]*a[1],a[5]+yRoots[y]*(a[4]+yRoots[y]*a[2]));var xRoots=xPoly.getRoots();for(var x=0;x<xRoots.length;x++){var test=(a[0]*xRoots[x]+a[1]*yRoots[y]+a[3])*xRoots[x]+(a[2]*yRoots[y]+a[4])*yRoots[y]+a[5];if(Math.abs(test)<norm0){test=(b[0]*xRoots[x]+b[1]*yRoots[y]+b[3])*xRoots[x]+(b[2]*yRoots[y]+b[4])*yRoots[y]+b[5];if(Math.abs(test)<norm1){result.appendPoint(new Point2D(xRoots[x],yRoots[y]));}}}}if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectEllipseLine=function(c,rx,ry,a1,a2){var result;var origin=new Vector2D(a1.x,a1.y);var dir=Vector2D.fromPoints(a1,a2);var center=new Vector2D(c.x,c.y);var diff=origin.subtract(center);var mDir=new Vector2D(dir.x/(rx*rx),  dir.y/(ry*ry));var mDiff=new Vector2D(diff.x/(rx*rx), diff.y/(ry*ry));var a=dir.dot(mDir);var b=dir.dot(mDiff);var c=diff.dot(mDiff)-1.0;var d=b*b-a*c;if(d<0){result=new Intersection("Outside");}else if(d>0){var root=Math.sqrt(d);var t_a=(-b-root)/a;var t_b=(-b+root)/a;if((t_a<0||1<t_a)&&(t_b<0||1<t_b)){if((t_a<0&&t_b<0)||(t_a>1&&t_b>1))result=new Intersection("Outside");else result=new Intersection("Inside");}else{result=new Intersection("Intersection");if(0<=t_a&&t_a<=1)result.appendPoint(a1.lerp(a2,t_a));if(0<=t_b&&t_b<=1)result.appendPoint(a1.lerp(a2,t_b));}}else{var t=-b/a;if(0<=t&&t<=1){result=new Intersection("Intersection");result.appendPoint(a1.lerp(a2,t));}else{result=new Intersection("Outside");}}return result;};
Intersection.intersectEllipsePolygon=function(c,rx,ry,points){var result=new Intersection("No Intersection");var length=points.length;for(var i=0;i<length;i++){var b1=points[i];var b2=points[(i+1)%length];var inter=Intersection.intersectEllipseLine(c,rx,ry,b1,b2);result.appendPoints(inter.points);}if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectEllipseRectangle=function(c,rx,ry,r1,r2){var min=r1.min(r2);var max=r1.max(r2);var topRight=new Point2D(max.x,min.y);var bottomLeft=new Point2D(min.x,max.y);var inter1=Intersection.intersectEllipseLine(c,rx,ry,min,topRight);var inter2=Intersection.intersectEllipseLine(c,rx,ry,topRight,max);var inter3=Intersection.intersectEllipseLine(c,rx,ry,max,bottomLeft);var inter4=Intersection.intersectEllipseLine(c,rx,ry,bottomLeft,min);var result=new Intersection("No Intersection");result.appendPoints(inter1.points);result.appendPoints(inter2.points);result.appendPoints(inter3.points);result.appendPoints(inter4.points);if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectLineLine=function(a1,a2,b1,b2){var result;var ua_t=(b2.x-b1.x)*(a1.y-b1.y)-(b2.y-b1.y)*(a1.x-b1.x);var ub_t=(a2.x-a1.x)*(a1.y-b1.y)-(a2.y-a1.y)*(a1.x-b1.x);var u_b=(b2.y-b1.y)*(a2.x-a1.x)-(b2.x-b1.x)*(a2.y-a1.y);if(u_b!=0){var ua=ua_t/u_b;var ub=ub_t/u_b;if(0<=ua&&ua<=1&&0<=ub&&ub<=1){result=new Intersection("Intersection");result.points.push(new Point2D(a1.x+ua*(a2.x-a1.x),a1.y+ua*(a2.y-a1.y)));}else{result=new Intersection("No Intersection");}}else{if(ua_t==0||ub_t==0){result=new Intersection("Coincident");}else{result=new Intersection("Parallel");}}return result;};
Intersection.intersectLinePolygon=function(a1,a2,points){var result=new Intersection("No Intersection");var length=points.length;for(var i=0;i<length;i++){var b1=points[i];var b2=points[(i+1)%length];var inter=Intersection.intersectLineLine(a1,a2,b1,b2);result.appendPoints(inter.points);}if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectLineRectangle=function(a1,a2,r1,r2){var min=r1.min(r2);var max=r1.max(r2);var topRight=new Point2D(max.x,min.y);var bottomLeft=new Point2D(min.x,max.y);var inter1=Intersection.intersectLineLine(min,topRight,a1,a2);var inter2=Intersection.intersectLineLine(topRight,max,a1,a2);var inter3=Intersection.intersectLineLine(max,bottomLeft,a1,a2);var inter4=Intersection.intersectLineLine(bottomLeft,min,a1,a2);var result=new Intersection("No Intersection");result.appendPoints(inter1.points);result.appendPoints(inter2.points);result.appendPoints(inter3.points);result.appendPoints(inter4.points);if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectPolygonPolygon=function(points1,points2){var result=new Intersection("No Intersection");var length=points1.length;for(var i=0;i<length;i++){var a1=points1[i];var a2=points1[(i+1)%length];var inter=Intersection.intersectLinePolygon(a1,a2,points2);result.appendPoints(inter.points);}if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectPolygonRectangle=function(points,r1,r2){var min=r1.min(r2);var max=r1.max(r2);var topRight=new Point2D(max.x,min.y);var bottomLeft=new Point2D(min.x,max.y);var inter1=Intersection.intersectLinePolygon(min,topRight,points);var inter2=Intersection.intersectLinePolygon(topRight,max,points);var inter3=Intersection.intersectLinePolygon(max,bottomLeft,points);var inter4=Intersection.intersectLinePolygon(bottomLeft,min,points);var result=new Intersection("No Intersection");result.appendPoints(inter1.points);result.appendPoints(inter2.points);result.appendPoints(inter3.points);result.appendPoints(inter4.points);if(result.points.length>0)result.status="Intersection";return result;};
Intersection.intersectRayRay=function(a1,a2,b1,b2){var result;var ua_t=(b2.x-b1.x)*(a1.y-b1.y)-(b2.y-b1.y)*(a1.x-b1.x);var ub_t=(a2.x-a1.x)*(a1.y-b1.y)-(a2.y-a1.y)*(a1.x-b1.x);var u_b=(b2.y-b1.y)*(a2.x-a1.x)-(b2.x-b1.x)*(a2.y-a1.y);if(u_b!=0){var ua=ua_t/u_b;result=new Intersection("Intersection");result.points.push(new Point2D(a1.x+ua*(a2.x-a1.x),a1.y+ua*(a2.y-a1.y)));}else{if(ua_t==0||ub_t==0){result=new Intersection("Coincident");}else{result=new Intersection("Parallel");}}return result;};
Intersection.intersectRectangleRectangle=function(a1,a2,b1,b2){var min=a1.min(a2);var max=a1.max(a2);var topRight=new Point2D(max.x,min.y);var bottomLeft=new Point2D(min.x,max.y);var inter1=Intersection.intersectLineRectangle(min,topRight,b1,b2);var inter2=Intersection.intersectLineRectangle(topRight,max,b1,b2);var inter3=Intersection.intersectLineRectangle(max,bottomLeft,b1,b2);var inter4=Intersection.intersectLineRectangle(bottomLeft,min,b1,b2);var result=new Intersection("No Intersection");result.appendPoints(inter1.points);result.appendPoints(inter2.points);result.appendPoints(inter3.points);result.appendPoints(inter4.points);if(result.points.length>0)result.status="Intersection";return result;};
Intersection.bezout=function(e1,e2){var AB=e1[0]*e2[1]-e2[0]*e1[1];var AC=e1[0]*e2[2]-e2[0]*e1[2];var AD=e1[0]*e2[3]-e2[0]*e1[3];var AE=e1[0]*e2[4]-e2[0]*e1[4];var AF=e1[0]*e2[5]-e2[0]*e1[5];var BC=e1[1]*e2[2]-e2[1]*e1[2];var BE=e1[1]*e2[4]-e2[1]*e1[4];var BF=e1[1]*e2[5]-e2[1]*e1[5];var CD=e1[2]*e2[3]-e2[2]*e1[3];var DE=e1[3]*e2[4]-e2[3]*e1[4];var DF=e1[3]*e2[5]-e2[3]*e1[5];var BFpDE=BF+DE;var BEmCD=BE-CD;return new Polynomial(AB*BC-AC*AC,AB*BEmCD+AD*BC-2*AC*AE,AB*BFpDE+AD*BEmCD-AE*AE-2*AC*AF,AB*DF+AD*BFpDE-2*AE*AF,AD*DF-AF*AF);};
function IntersectionParams(name,params){if(arguments.length>0)this.init(name,params);}
IntersectionParams.prototype.init=function(name,params){this.name=name;this.params=params;};
function Point2D(x,y){if(arguments.length>0){this.x=x;this.y=y;}}
Point2D.prototype.clone=function(){return new Point2D(this.x,this.y);};
Point2D.prototype.add=function(that){return new Point2D(this.x+that.x,this.y+that.y);};
Point2D.prototype.addEquals=function(that){this.x+=that.x;this.y+=that.y;return this;};
Point2D.prototype.offset=function(a,b){var result=0;if(!(b.x<=this.x||this.x+a.x<=0)){var t=b.x*a.y-a.x*b.y;var s;var d;if(t>0){if(this.x<0){s=this.x*a.y;d=s/a.x-this.y;}else if(this.x>0){s=this.x*b.y;d=s/b.x-this.y}else{d=-this.y;}}else{if(b.x<this.x+a.x){s=(b.x-this.x)*a.y;d=b.y-(this.y+s/a.x);}else if(b.x>this.x+a.x){s=(a.x+this.x)*b.y;d=s/b.x-(this.y+a.y);}else{d=b.y-(this.y+a.y);}}if(d>0){result=d;}}return result;};
Point2D.prototype.rmoveto=function(dx,dy){this.x+=dx;this.y+=dy;};
Point2D.prototype.scalarAdd=function(scalar){return new Point2D(this.x+scalar,this.y+scalar);};
Point2D.prototype.scalarAddEquals=function(scalar){this.x+=scalar;this.y+=scalar;return this;};
Point2D.prototype.subtract=function(that){return new Point2D(this.x-that.x,this.y-that.y);};
Point2D.prototype.subtractEquals=function(that){this.x-=that.x;this.y-=that.y;return this;};
Point2D.prototype.scalarSubtract=function(scalar){return new Point2D(this.x-scalar,this.y-scalar);};
Point2D.prototype.scalarSubtractEquals=function(scalar){this.x-=scalar;this.y-=scalar;return this;};
Point2D.prototype.multiply=function(scalar){return new Point2D(this.x*scalar,this.y*scalar);};
Point2D.prototype.multiplyEquals=function(scalar){this.x*=scalar;this.y*=scalar;return this;};
Point2D.prototype.divide=function(scalar){return new Point2D(this.x/scalar, this.y/scalar);};
Point2D.prototype.divideEquals=function(scalar){this.x/=scalar;this.y/=scalar;return this;};
Point2D.prototype.compare=function(that){return(this.x-that.x||this.y-that.y);};
Point2D.prototype.eq=function(that){return(this.x==that.x&&this.y==that.y);};
Point2D.prototype.lt=function(that){return(this.x<that.x&&this.y<that.y);};
Point2D.prototype.lte=function(that){return(this.x<=that.x&&this.y<=that.y);};
Point2D.prototype.gt=function(that){return(this.x>that.x&&this.y>that.y);};
Point2D.prototype.gte=function(that){return(this.x>=that.x&&this.y>=that.y);};
Point2D.prototype.lerp=function(that,t){return new Point2D(this.x+(that.x-this.x)*t,this.y+(that.y-this.y)*t);};
Point2D.prototype.distanceFrom=function(that){var dx=this.x-that.x;var dy=this.y-that.y;return Math.sqrt(dx*dx+dy*dy);};
Point2D.prototype.min=function(that){return new Point2D(Math.min(this.x,that.x),Math.min(this.y,that.y));};
Point2D.prototype.max=function(that){return new Point2D(Math.max(this.x,that.x),Math.max(this.y,that.y));};
Point2D.prototype.toString=function(){return this.x+","+this.y;};
Point2D.prototype.setXY=function(x,y){this.x=x;this.y=y;};
Point2D.prototype.setFromPoint=function(that){this.x=that.x;this.y=that.y;};
Point2D.prototype.swap=function(that){var x=this.x;var y=this.y;this.x=that.x;this.y=that.y;that.x=x;that.y=y;};
Polynomial.TOLERANCE=1e-6;
Polynomial.ACCURACY=6;
Polynomial.interpolate=function(xs,ys,n,offset,x){if(xs.constructor!==Array||ys.constructor!==Array)throw new Error("Polynomial.interpolate: xs and ys must be arrays");if(isNaN(n)||isNaN(offset)||isNaN(x))throw new Error("Polynomial.interpolate: n, offset, and x must be numbers");var y=0;var dy=0;var c=new Array(n);var d=new Array(n);var ns=0;var result;var diff=Math.abs(x-xs[offset]);for(var i=0;i<n;i++){var dift=Math.abs(x-xs[offset+i]);if(dift<diff){ns=i;diff=dift;}c[i]=d[i]=ys[offset+i];}y=ys[offset+ns];ns--;for(var m=1;m<n;m++){for(var i=0;i<n-m;i++){var ho=xs[offset+i]-x;var hp=xs[offset+i+m]-x;var w=c[i+1]-d[i];var den=ho-hp;if(den==0.0){result={y:0,dy:0};break;}den=w/den;d[i]=hp*den;c[i]=ho*den;}dy=(2*(ns+1)<(n-m))?c[ns+1]:d[ns--];y+=dy;}return{y:y,dy:dy};};
function Polynomial(){this.init(arguments);}
Polynomial.prototype.init=function(coefs){this.coefs=new Array();for(var i=coefs.length-1;i>=0;i--)this.coefs.push(coefs[i]);this._variable="t";this._s=0;};
Polynomial.prototype.eval=function(x){if(isNaN(x))throw new Error("Polynomial.eval: parameter must be a number");var result=0;for(var i=this.coefs.length-1;i>=0;i--)result=result*x+this.coefs[i];return result;};
Polynomial.prototype.add=function(that){var result=new Polynomial();var d1=this.getDegree();var d2=that.getDegree();var dmax=Math.max(d1,d2);for(var i=0;i<=dmax;i++){var v1=(i<=d1)?this.coefs[i]:0;var v2=(i<=d2)?that.coefs[i]:0;result.coefs[i]=v1+v2;}return result;};
Polynomial.prototype.multiply=function(that){var result=new Polynomial();for(var i=0;i<=this.getDegree()+that.getDegree();i++)result.coefs.push(0);for(var i=0;i<=this.getDegree();i++)for(var j=0;j<=that.getDegree();j++)result.coefs[i+j]+=this.coefs[i]*that.coefs[j];return result;};
Polynomial.prototype.divide_scalar=function(scalar){for(var i=0;i<this.coefs.length;i++)this.coefs[i]/=scalar;};
Polynomial.prototype.simplify=function(){for(var i=this.getDegree();i>=0;i--){if(Math.abs(this.coefs[i])<=Polynomial.TOLERANCE)this.coefs.pop();else break;}};
Polynomial.prototype.bisection=function(min,max){var minValue=this.eval(min);var maxValue=this.eval(max);var result;if(Math.abs(minValue)<=Polynomial.TOLERANCE)result=min;else if(Math.abs(maxValue)<=Polynomial.TOLERANCE)result=max;else if(minValue*maxValue<=0){var tmp1=Math.log(max-min);var tmp2=Math.LN10*Polynomial.ACCURACY;var iters=Math.ceil((tmp1+tmp2)/Math.LN2);for(var i=0;i<iters;i++){result=0.5*(min+max);var value=this.eval(result);if(Math.abs(value)<=Polynomial.TOLERANCE){break;}if(value*minValue<0){max=result;maxValue=value;}else{min=result;minValue=value;}}}return result;};
Polynomial.prototype.toString=function(){var coefs=new Array();var signs=new Array();for(var i=this.coefs.length-1;i>=0;i--){var value=Math.round(this.coefs[i]*1000)/1000;if(value!=0){var sign=(value<0)?" - ":" + ";value=Math.abs(value);if(i>0)if(value==1)value=this._variable;else value+=this._variable;if(i>1)value+="^"+i;signs.push(sign);coefs.push(value);}}signs[0]=(signs[0]==" + ")?"":"-";var result="";for(var i=0;i<coefs.length;i++)result+=signs[i]+coefs[i];return result;};
Polynomial.prototype.trapezoid=function(min,max,n){if(isNaN(min)||isNaN(max)||isNaN(n))throw new Error("Polynomial.trapezoid: parameters must be numbers");var range=max-min;var TOLERANCE=1e-7;if(n==1){var minValue=this.eval(min);var maxValue=this.eval(max);this._s=0.5*range*(minValue+maxValue);}else{var it=1<<(n-2);var delta=range/it;var x=min+0.5*delta;var sum=0;for(var i=0;i<it;i++){sum+=this.eval(x);x+=delta;}this._s=0.5*(this._s+range*sum/it);}if(isNaN(this._s))throw new Error("Polynomial.trapezoid: this._s is NaN");return this._s;};
Polynomial.prototype.simpson=function(min,max){if(isNaN(min)||isNaN(max))throw new Error("Polynomial.simpson: parameters must be numbers");var range=max-min;var st=0.5*range*(this.eval(min)+this.eval(max));var t=st;var s=4.0*st/3.0;var os=s;var ost=st;var TOLERANCE=1e-7;var it=1;for(var n=2;n<=20;n++){var delta=range/it;var x=min+0.5*delta;var sum=0;for(var i=1;i<=it;i++){sum+=this.eval(x);x+=delta;}t=0.5*(t+range*sum/it);st=t;s=(4.0*st-ost)/3.0;if(Math.abs(s-os)<TOLERANCE*Math.abs(os))break;os=s;ost=st;it<<=1;}return s;};
Polynomial.prototype.romberg=function(min,max){if(isNaN(min)||isNaN(max))throw new Error("Polynomial.romberg: parameters must be numbers");var MAX=20;var K=3;var TOLERANCE=1e-6;var s=new Array(MAX+1);var h=new Array(MAX+1);var result={y:0,dy:0};h[0]=1.0;for(var j=1;j<=MAX;j++){s[j-1]=this.trapezoid(min,max,j);if(j>=K){result=Polynomial.interpolate(h,s,K,j-K,0.0);if(Math.abs(result.dy)<=TOLERANCE*result.y)break;}s[j]=s[j-1];h[j]=0.25*h[j-1];}return result.y;};
Polynomial.prototype.getDegree=function(){return this.coefs.length-1;};
Polynomial.prototype.getDerivative=function(){var derivative=new Polynomial();for(var i=1;i<this.coefs.length;i++){derivative.coefs.push(i*this.coefs[i]);}return derivative;};
Polynomial.prototype.getRoots=function(){var result;this.simplify();switch(this.getDegree()){case 0:result=new Array();break;case 1:result=this.getLinearRoot();break;case 2:result=this.getQuadraticRoots();break;case 3:result=this.getCubicRoots();break;case 4:result=this.getQuarticRoots();break;default:result=new Array();}return result;};
Polynomial.prototype.getRootsInInterval=function(min,max){var roots=new Array();var root;if(this.getDegree()==1){root=this.bisection(min,max);if(root!=null)roots.push(root);}else{var deriv=this.getDerivative();var droots=deriv.getRootsInInterval(min,max);if(droots.length>0){root=this.bisection(min,droots[0]);if(root!=null)roots.push(root);for(i=0;i<=droots.length-2;i++){root=this.bisection(droots[i],droots[i+1]);if(root!=null)roots.push(root);}root=this.bisection(droots[droots.length-1],max);if(root!=null)roots.push(root);}else{root=this.bisection(min,max);if(root!=null)roots.push(root);}}return roots;};
Polynomial.prototype.getLinearRoot=function(){var result=new Array();var a=this.coefs[1];if(a!=0)result.push(-this.coefs[0]/a);return result;};
Polynomial.prototype.getQuadraticRoots=function(){var results=new Array();if(this.getDegree()==2){var a=this.coefs[2];var b=this.coefs[1]/a;var c=this.coefs[0]/a;var d=b*b-4*c;if(d>0){var e=Math.sqrt(d);results.push(0.5*(-b+e));results.push(0.5*(-b-e));}else if(d==0){results.push(0.5*-b);}}return results;};
Polynomial.prototype.getCubicRoots=function(){var results=new Array();if(this.getDegree()==3){var c3=this.coefs[3];var c2=this.coefs[2]/c3;var c1=this.coefs[1]/c3;var c0=this.coefs[0]/c3;var a=(3*c1-c2*c2)/3;var b=(2*c2*c2*c2-9*c1*c2+27*c0)/27;var offset=c2/3;var discrim=b*b/4 + a*a*a/27;var halfB=b/2;if(Math.abs(discrim)<=Polynomial.TOLERANCE)disrim=0;if(discrim>0){var e=Math.sqrt(discrim);var tmp;var root;tmp=-halfB+e;if(tmp>=0)root=Math.pow(tmp,1/3);else root=-Math.pow(-tmp,1/3);tmp=-halfB-e;if(tmp>=0)root+=Math.pow(tmp,1/3);else root-=Math.pow(-tmp,1/3);results.push(root-offset);}else if(discrim<0){var distance=Math.sqrt(-a/3);var angle=Math.atan2(Math.sqrt(-discrim),-halfB)/3;var cos=Math.cos(angle);var sin=Math.sin(angle);var sqrt3=Math.sqrt(3);results.push(2*distance*cos-offset);results.push(-distance*(cos+sqrt3*sin)-offset);results.push(-distance*(cos-sqrt3*sin)-offset);}else{var tmp;if(halfB>=0)tmp=-Math.pow(halfB,1/3);else tmp=Math.pow(-halfB,1/3);results.push(2*tmp-offset);results.push(-tmp-offset);}}return results;};
Polynomial.prototype.getQuarticRoots=function(){var results=new Array();if(this.getDegree()==4){var c4=this.coefs[4];var c3=this.coefs[3]/c4;var c2=this.coefs[2]/c4;var c1=this.coefs[1]/c4;var c0=this.coefs[0]/c4;var resolveRoots=new Polynomial(1,-c2,c3*c1-4*c0,-c3*c3*c0+4*c2*c0-c1*c1).getCubicRoots();var y=resolveRoots[0];var discrim=c3*c3/4-c2+y;if(Math.abs(discrim)<=Polynomial.TOLERANCE)discrim=0;if(discrim>0){var e=Math.sqrt(discrim);var t1=3*c3*c3/4-e*e-2*c2;var t2=(4*c3*c2-8*c1-c3*c3*c3)/(4*e);var plus=t1+t2;var minus=t1-t2;if(Math.abs(plus)<=Polynomial.TOLERANCE)plus=0;if(Math.abs(minus)<=Polynomial.TOLERANCE)minus=0;if(plus>=0){var f=Math.sqrt(plus);results.push(-c3/4 + (e+f)/2);results.push(-c3/4 + (e-f)/2);}if(minus>=0){var f=Math.sqrt(minus);results.push(-c3/4 + (f-e)/2);results.push(-c3/4 - (f+e)/2);}}else if(discrim<0){}else{var t2=y*y-4*c0;if(t2>=-Polynomial.TOLERANCE){if(t2<0)t2=0;t2=2*Math.sqrt(t2);t1=3*c3*c3/4-2*c2;if(t1+t2>=Polynomial.TOLERANCE){var d=Math.sqrt(t1+t2);results.push(-c3/4 + d/2);results.push(-c3/4 - d/2);}if(t1-t2>=Polynomial.TOLERANCE){var d=Math.sqrt(t1-t2);results.push(-c3/4 + d/2);results.push(-c3/4 - d/2);}}}}return results;};
function Vector2D(x,y){if(arguments.length>0){this.x=x;this.y=y;}}
Vector2D.prototype.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y);};
Vector2D.prototype.dot=function(that){return this.x*that.x+this.y*that.y;};
Vector2D.prototype.cross=function(that){return this.x*that.y-this.y*that.x;}
Vector2D.prototype.unit=function(){return this.divide(this.length());};
Vector2D.prototype.unitEquals=function(){this.divideEquals(this.length());return this;};
Vector2D.prototype.add=function(that){return new Vector2D(this.x+that.x,this.y+that.y);};
Vector2D.prototype.addEquals=function(that){this.x+=that.x;this.y+=that.y;return this;};
Vector2D.prototype.subtract=function(that){return new Vector2D(this.x-that.x,this.y-that.y);};
Vector2D.prototype.subtractEquals=function(that){this.x-=that.x;this.y-=that.y;return this;};
Vector2D.prototype.multiply=function(scalar){return new Vector2D(this.x*scalar,this.y*scalar);};
Vector2D.prototype.multiplyEquals=function(scalar){this.x*=scalar;this.y*=scalar;return this;};
Vector2D.prototype.divide=function(scalar){return new Vector2D(this.x/ scalar, this.y /scalar);};
Vector2D.prototype.divideEquals=function(scalar){this.x/=scalar;this.y/=scalar;return this;};
Vector2D.prototype.perp=function(){return new Vector2D(-this.y,this.x);};
Vector2D.prototype.perpendicular=function(that){return this.subtract(this.project(that));};
Vector2D.prototype.project=function(that){var percent=this.dot(that)/that.dot(that);return that.multiply(percent);};
Vector2D.prototype.toString=function(){return this.x+","+this.y;};
Vector2D.fromPoints=function(p1,p2){return new Vector2D(p2.x-p1.x,p2.y-p1.y);};
Shape.prototype=new EventHandler();
Shape.prototype.constructor=Shape;
Shape.superclass=EventHandler.prototype;
function Shape(svgNode){if(arguments.length>0){this.init(svgNode);}}
Shape.prototype.init=function(svgNode){this.svgNode=svgNode;this.locked=false;this.visible=true;this.selected=false;this.callback=null;this.lastUpdate=null;}
Shape.prototype.show=function(state){var display=(state)?"inline":"none";this.visible=state;this.svgNode.setAttributeNS(null,"display",display);};
Shape.prototype.refresh=function(){};
Shape.prototype.update=function(){this.refresh();if(this.owner)this.owner.update(this);if(this.callback!=null)this.callback(this);};
Shape.prototype.translate=function(delta){};
Shape.prototype.select=function(state){this.selected=state;};
Shape.prototype.registerHandles=function(){};
Shape.prototype.unregisterHandles=function(){};
Shape.prototype.selectHandles=function(select){};
Shape.prototype.showHandles=function(state){};
Shape.prototype.handleMouseDown=function(){};
Shape.prototype.mouseup=function(){
    if(!this.lockSelection&&!this.dragged){
        if(this.handlesSelected){
            this.selectHandles(false);
            this.handlesSelected = false;
        }
    }
    this.lockSelection = false;
    this.dragged = false;
};
Shape.prototype.mouseleave=function(e){};
Shape.prototype.mousedown=function(e,x,y){
    if(!this.locked){
        if(e.shiftKey){
            if(this.selected){
                mouser.unregisterShape(this);
            }else{
                mouser.registerShape(this);
                this.showHandles(true);
                this.selectHandles(true);
                this.registerHandles();
            }
        }else{
            if(this.selected){
                if(this.toggleHandles){
                    if(this.handlesSelected){
                        //this.selectHandles(false);
                        //this.handlesSelected = false;
                    }else{
                        this.selectHandles(true);
                        this.handlesSelected = true;
                        this.lockSelection=true;
                    }
                    mouser.beginDrag(e,x,y)
                    this.registerHandles();
                }else{
                    this.selectHandles(true);
                    this.registerHandles();
                }
            }else{
                mouser.unregisterShapes();
                mouser.registerShape(this);
                this.showHandles(true);
                this.selectHandles(false);
            }
            this.handleMouseDown();
        }
    }
};
Circle.prototype=new Shape();
Circle.prototype.constructor=Circle;
Circle.superclass=Shape.prototype;
function Circle(svgNode){if(arguments.length>0){this.init(svgNode);}}
Circle.prototype.init=function(svgNode){if(svgNode.localName=="circle"){Circle.superclass.init.call(this,svgNode);var cx=parseFloat(svgNode.getAttributeNS(null,"cx"));var cy=parseFloat(svgNode.getAttributeNS(null,"cy"));var r=parseFloat(svgNode.getAttributeNS(null,"r"));this.center=new Handle(cx,cy,this);this.last=new Point2D(cx,cy);this.radius=new Handle(cx+r,cy,this);}else{throw new Error("Circle.init: Invalid SVG Node: "+svgNode.localName);}};
Circle.prototype.realize=function(){if(this.svgNode!=null){this.center.realize();this.radius.realize();this.center.show(false);this.radius.show(false);mouser.addEvent("press",this.svgNode,this);}};
Circle.prototype.unrealize=function() { this.center.unrealize();this.radius.unrealize();if ( this.svgNode != null ) {mouser.removeEvent("press",this.svgNode,this);}};
Circle.prototype.translate=function(delta){this.center.translate(delta);this.radius.translate(delta);this.refresh();};
Circle.prototype.refresh=function(){var r=this.radius.point.distanceFrom(this.center.point);this.svgNode.setAttributeNS(null,"cx",this.center.point.x);this.svgNode.setAttributeNS(null,"cy",this.center.point.y);this.svgNode.setAttributeNS(null,"r",r);};
Circle.prototype.registerHandles=function(){mouser.register(this.center);mouser.register(this.radius);};
Circle.prototype.unregisterHandles=function(){mouser.unregister(this.center);mouser.unregister(this.radius);};
Circle.prototype.selectHandles=function(select){this.center.select(select);this.radius.select(select);};
Circle.prototype.showHandles=function(state){this.center.show(state);this.radius.show(state);};
Circle.prototype.getIntersectionParams=function(){return new IntersectionParams("Circle",[this.center.point,parseFloat(this.svgNode.getAttributeNS(null,"r"))]);};
Ellipse.prototype=new Shape();
Ellipse.prototype.constructor=Ellipse;
Ellipse.superclass=Shape.prototype;
function Ellipse(svgNode){if(arguments.length>0){this.init(svgNode);}}
Ellipse.prototype.init=function(svgNode){if(svgNode==null||svgNode.localName!="ellipse")throw new Error("Ellipse.init: Invalid localName: "+svgNode.localName);Ellipse.superclass.init.call(this,svgNode);var cx=parseFloat(svgNode.getAttributeNS(null,"cx"));var cy=parseFloat(svgNode.getAttributeNS(null,"cy"));var rx=parseFloat(svgNode.getAttributeNS(null,"rx"));var ry=parseFloat(svgNode.getAttributeNS(null,"ry"));this.center=new Handle(cx,cy,this);this.radiusX=new Handle(cx+rx,cy,this);this.radiusY=new Handle(cx,cy+ry,this);};
Ellipse.prototype.realize=function(){this.center.realize();this.radiusX.realize();this.radiusY.realize();this.center.show(false);this.radiusX.show(false);this.radiusY.show(false);mouser.addEvent("press",this.svgNode,this);};
Ellipse.prototype.unrealize = function() {this.center.unrealize();this.radiusX.unrealize();this.radiusY.unrealize();mouser.removeEvent("press",this.svgNode,this);};
Ellipse.prototype.refresh=function(){var rx=Math.abs(this.center.point.x-this.radiusX.point.x);var ry=Math.abs(this.center.point.y-this.radiusY.point.y);this.svgNode.setAttributeNS(null,"cx",this.center.point.x);this.svgNode.setAttributeNS(null,"cy",this.center.point.y);this.svgNode.setAttributeNS(null,"rx",rx);this.svgNode.setAttributeNS(null,"ry",ry);};
Ellipse.prototype.registerHandles=function(){mouser.register(this.center);mouser.register(this.radiusX);mouser.register(this.radiusY);};
Ellipse.prototype.unregisterHandles=function(){mouser.unregister(this.center);mouser.unregister(this.radiusX);mouser.unregister(this.radiusY);};
Ellipse.prototype.selectHandles=function(select){this.center.select(select);this.radiusX.select(select);this.radiusY.select(select);};
Ellipse.prototype.showHandles=function(state){this.center.show(state);this.radiusX.show(state);this.radiusY.show(state);};
Ellipse.prototype.getIntersectionParams=function(){return new IntersectionParams("Ellipse",[this.center.point,parseFloat(this.svgNode.getAttributeNS(null,"rx")),parseFloat(this.svgNode.getAttributeNS(null,"ry"))]);};
Handle.prototype=new Shape();
Handle.prototype.constructor=Handle;
Handle.superclass=Shape.prototype;
Handle.NO_CONSTRAINTS=0;
Handle.CONSTRAIN_X=1;
Handle.CONSTRAIN_Y=2;
function Handle(x,y,owner){if(arguments.length>0){this.init(x,y,owner);}}
Handle.prototype.init=function(x,y,owner){Handle.superclass.init.call(this,null);this.point=new Point2D(x,y);this.owner=owner;this.constrain=Handle.NO_CONSTRAINTS;}
Handle.prototype.realize=function(){if(this.svgNode==null){var svgns="http://www.w3.org/2000/svg";var handle=document.createElementNS(svgns,"rect");var parent;if(this.owner!=null&&this.owner.svgNode!=null){parent=this.owner.svgNode.parentNode;}else{parent=svg;}handle.setAttributeNS(null,"x",this.point.x-(D2isTouch?10:5));handle.setAttributeNS(null,"y",this.point.y-(D2isTouch?10:5));handle.setAttributeNS(null,"width",(D2isTouch?20:10));handle.setAttributeNS(null,"height",(D2isTouch?20:10));handle.setAttributeNS(null,"stroke","black");handle.setAttributeNS(null,"fill","white");mouser.addEvent("press",handle,this);parent.appendChild(handle);this.svgNode=handle;this.show(this.visible);}};
Handle.prototype.unrealize=function(){mouser.removeEvent("press",this.svgNode,this);if(this.svgNode.parentNode)this.svgNode.parentNode.removeChild(this.svgNode);};
Handle.prototype.translate=function(delta){if(this.constrain==Handle.CONSTRAIN_X){this.point.x+=delta.x;}else if(this.constrain==Handle.CONSTRAIN_Y){this.point.y+=delta.y;}else{this.point.addEquals(delta);}this.refresh();};
Handle.prototype.refresh=function(){this.svgNode.setAttributeNS(null,"x",this.point.x-(D2isTouch?10:5));this.svgNode.setAttributeNS(null,"y",this.point.y-(D2isTouch?10:5));};
Handle.prototype.select=function(state){Handle.superclass.select.call(this,state);if(state){this.svgNode.setAttributeNS(null,"fill","black");}else{this.svgNode.setAttributeNS(null,"fill","white");}};
Handle.prototype.mousedown=function(e,x,y){
    //svg.getElementById("info").textContent+=3;
    if(!this.locked){
        if(e.shiftKey){
            if(this.selected){
            // svg.getElementById("info").textContent+=2;
                mouser.unregister(this);
            }else{
                mouser.register(this);
                    mouser.beginDrag(e,x,y);
            }
        }else{
            //svg.getElementById("info").textContent+1;
            if(!this.selected){
                var owner=this.owner;
                mouser.unregisterAll();
                mouser.register(this);
            }
            mouser.beginDrag(e,x,y);
        }
    }
    this.owner.handleMouseDown()
};
Lever.prototype=new Shape();
Lever.prototype.constructor=Lever;
Lever.superclass=Shape.prototype;
function Lever(x1,y1,x2,y2,owner){if(arguments.length>0){this.init(x1,y1,x2,y2,owner);}}
Lever.prototype.init=function(x1,y1,x2,y2,owner){Lever.superclass.init.call(this,null);this.point=new Handle(x1,y1,this);this.lever=new LeverHandle(x2,y2,this);this.owner=owner;};
Lever.prototype.realize=function(){if(this.svgNode==null){var svgns="http://www.w3.org/2000/svg";var line=document.createElementNS(svgns,"line");var parent;if(this.owner!=null&&this.owner.svgNode!=null){parent=this.owner.svgNode.parentNode;}else{parent=svg;}line.setAttributeNS(null,"x1",this.point.point.x);line.setAttributeNS(null,"y1",this.point.point.y);line.setAttributeNS(null,"x2",this.lever.point.x);line.setAttributeNS(null,"y2",this.lever.point.y);line.setAttributeNS(null,"stroke","black");parent.appendChild(line);this.svgNode=line;this.point.realize();this.lever.realize();this.show(this.visible);}};
Lever.prototype.refresh=function(){this.svgNode.setAttributeNS(null,"x1",this.point.point.x);this.svgNode.setAttributeNS(null,"y1",this.point.point.y);this.svgNode.setAttributeNS(null,"x2",this.lever.point.x);this.svgNode.setAttributeNS(null,"y2",this.lever.point.y);};
LeverHandle.prototype=new Handle();
LeverHandle.prototype.constructor=LeverHandle;
LeverHandle.superclass=Handle.prototype;
function LeverHandle(x,y,owner){if(arguments.length>0){this.init(x,y,owner);}}
LeverHandle.prototype.realize=function(){if(this.svgNode==null){var svgns="http://www.w3.org/2000/svg";var handle=document.createElementNS(svgns,"circle");var parent;if(this.owner!=null&&this.owner.svgNode!=null){parent=this.owner.svgNode.parentNode;}else{parent=svg;}handle.setAttributeNS(null,"cx",this.point.x);handle.setAttributeNS(null,"cy",this.point.y);handle.setAttributeNS(null,"r",2.5);handle.setAttributeNS(null,"fill","black");mouser.addEvent("press",handle,this);parent.appendChild(handle);this.svgNode=handle;this.show(this.visible);}};
LeverHandle.prototype.unrealize=function(){mouser.removeEvent("press",this.svgNode,this);};
LeverHandle.prototype.refresh=function(){this.svgNode.setAttributeNS(null,"cx",this.point.x);this.svgNode.setAttributeNS(null,"cy",this.point.y);};
LeverHandle.prototype.select=function(state){LeverHandle.superclass.select.call(this,state);this.svgNode.setAttributeNS(null,"fill","black");};
Line.prototype=new Shape();
Line.prototype.constructor=Line;
Line.superclass=Shape.prototype;
function Line(svgNode){if(arguments.length>0){this.init(svgNode);}}
Line.prototype.init=function(svgNode){if(svgNode==null||svgNode.localName!="line")throw new Error("Line.init: Invalid localName: "+svgNode.localName);Line.superclass.init.call(this,svgNode);var x1=parseFloat(svgNode.getAttributeNS(null,"x1"));var y1=parseFloat(svgNode.getAttributeNS(null,"y1"));var x2=parseFloat(svgNode.getAttributeNS(null,"x2"));var y2=parseFloat(svgNode.getAttributeNS(null,"y2"));this.p1=new Handle(x1,y1,this);this.p2=new Handle(x2,y2,this);};
Line.prototype.realize=function(){this.p1.realize();this.p2.realize();this.p1.show(false);this.p2.show(false);mouser.addEvent("press",this.svgNode,this);};
Line.prototype.unrealize = function() {this.p1.unrealize();this.p2.unrealize();mouser.removeEvent("press",this.svgNode,this);};
Line.prototype.refresh=function(){this.svgNode.setAttributeNS(null,"x1",this.p1.point.x);this.svgNode.setAttributeNS(null,"y1",this.p1.point.y);this.svgNode.setAttributeNS(null,"x2",this.p2.point.x);this.svgNode.setAttributeNS(null,"y2",this.p2.point.y);};
Line.prototype.registerHandles=function(){mouser.register(this.p1);mouser.register(this.p2);};
Line.prototype.unregisterHandles=function(){mouser.unregister(this.p1);mouser.unregister(this.p2);};
Line.prototype.selectHandles=function(select){this.p1.select(select);this.p2.select(select);};
Line.prototype.showHandles=function(state){this.p1.show(state);this.p2.show(state);};
Line.prototype.cut=function(t){var cutPoint=this.p1.point.lerp(this.p2.point,t);var newLine=this.svgNode.cloneNode(true);this.p2.point.setFromPoint(cutPoint);this.p2.update();if(this.svgNode.nextSibling!=null)this.svgNode.parentNode.insertBefore(newLine,this.svgNode.nextSibling);else this.svgNode.parentNode.appendChild(newLine);var line=new Line(newLine);line.realize();line.p1.point.setFromPoint(cutPoint);line.p1.update();};
Line.prototype.getIntersectionParams=function(){return new IntersectionParams("Line",[this.p1.point,this.p2.point]);};
function Token(type,text){if(arguments.length>0){this.init(type,text);}}
Token.prototype.init=function(type,text){this.type=type;this.text=text;};
Token.prototype.typeis=function(type){return this.type==type;}
Path.prototype=new Shape();
Path.prototype.constructor=Path;
Path.superclass=Shape.prototype;
Path.COMMAND=0;
Path.NUMBER=1;
Path.EOD=2;
Path.PARAMS={A:["rx","ry","x-axis-rotation","large-arc-flag","sweep-flag","x","y"],a:["rx","ry","x-axis-rotation","large-arc-flag","sweep-flag","x","y"],C:["x1","y1","x2","y2","x","y"],c:["x1","y1","x2","y2","x","y"],H:["x"],h:["x"],L:["x","y"],l:["x","y"],M:["x","y"],m:["x","y"],Q:["x1","y1","x","y"],q:["x1","y1","x","y"],S:["x2","y2","x","y"],s:["x2","y2","x","y"],T:["x","y"],t:["x","y"],V:["y"],v:["y"],Z:[],z:[]};
function Path(svgNode){if(arguments.length>0){this.init(svgNode);}}
Path.prototype.init=function(svgNode){if(svgNode==null||svgNode.localName!="path")throw new Error("Path.init: Invalid localName: "+svgNode.localName);Path.superclass.init.call(this,svgNode);this.segments=null;this.parseData(svgNode.getAttributeNS(null,"d"));};
Path.prototype.realize=function(){for(var i=0;i<this.segments.length;i++){this.segments[i].realize();}mouser.addEvent("press",this.svgNode,this);};
Path.prototype.unrealize=function(){for(var i=0;i<this.segments.length;i++){this.segments[i].unrealize();}mouser.removeEvent("press",this.svgNode,this);};
Path.prototype.refresh=function(){var d=new Array();for(var i=0;i<this.segments.length;i++){d.push(this.segments[i].toString());}this.svgNode.setAttributeNS(null,"d",d.join(" "));};
Path.prototype.registerHandles=function(){for(var i=0;i<this.segments.length;i++){this.segments[i].registerHandles();}};
Path.prototype.unregisterHandles=function(){for(var i=0;i<this.segments.length;i++){this.segments[i].unregisterHandles();}};
Path.prototype.selectHandles=function(select){for(var i=0;i<this.segments.length;i++){this.segments[i].selectHandles(select);}};
Path.prototype.showHandles=function(state){for(var i=0;i<this.segments.length;i++){this.segments[i].showHandles(state);}};
Path.prototype.appendPathSegment=function(segment){segment.previous=this.segments[this.segments.length-1];this.segments.push(segment);};
Path.prototype.parseData=function(d){var tokens=this.tokenize(d);var index=0;var token=tokens[index];var mode="BOD";this.segments=new Array();while(!token.typeis(Path.EOD)){var param_length;var params=new Array();if(mode=="BOD"){if(token.text=="M"||token.text=="m"){index++;param_length=Path.PARAMS[token.text].length;mode=token.text;}else{throw new Error("Path data must begin with a moveto command");}}else{if(token.typeis(Path.NUMBER)){param_length=Path.PARAMS[mode].length;}else{index++;param_length=Path.PARAMS[token.text].length;mode=token.text;}}if((index+param_length)<tokens.length){for(var i=index;i<index+param_length;i++){var number=tokens[i];if(number.typeis(Path.NUMBER))params[params.length]=number.text;else throw new Error("Parameter type is not a number: "+mode+","+number.text);}var segment;var length=this.segments.length;var previous=(length==0)?null:this.segments[length-1];switch(mode){case"A":segment=new AbsoluteArcPath(params,this,previous);break;case"C":segment=new AbsoluteCurveto3(params,this,previous);break;case"c":segment=new RelativeCurveto3(params,this,previous);break;case"H":segment=new AbsoluteHLineto(params,this,previous);break;case"L":segment=new AbsoluteLineto(params,this,previous);break;case"l":segment=new RelativeLineto(params,this,previous);break;case"M":segment=new AbsoluteMoveto(params,this,previous);break;case"m":segment=new RelativeMoveto(params,this,previous);break;case"Q":segment=new AbsoluteCurveto2(params,this,previous);break;case"q":segment=new RelativeCurveto2(params,this,previous);break;case"S":segment=new AbsoluteSmoothCurveto3(params,this,previous);break;case"s":segment=new RelativeSmoothCurveto3(params,this,previous);break;case"T":segment=new AbsoluteSmoothCurveto2(params,this,previous);break;case"t":segment=new RelativeSmoothCurveto2(params,this,previous);break;case"Z":segment=new RelativeClosePath(params,this,previous);break;case"z":segment=new RelativeClosePath(params,this,previous);break;default:throw new Error("Unsupported segment type: "+mode);};this.segments.push(segment);index+=param_length;token=tokens[index];if(mode=="M")mode="L";if(mode=="m")mode="l";}else{throw new Error("Path data ended before all parameters were found");}}}
Path.prototype.tokenize=function(d){var tokens=new Array();while(d!=""){if(d.match(/^([ \t\r\n,]+)/)){d=d.substr(RegExp.$1.length);}else if(d.match(/^([aAcChHlLmMqQsStTvVzZ])/)){tokens[tokens.length]=new Token(Path.COMMAND,RegExp.$1);d=d.substr(RegExp.$1.length);}else if(d.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)){tokens[tokens.length]=new Token(Path.NUMBER,parseFloat(RegExp.$1));d=d.substr(RegExp.$1.length);}else{throw new Error("Unrecognized segment command: "+d);}}tokens[tokens.length]=new Token(Path.EOD,null);return tokens;}
Path.prototype.intersectShape=function(shape){var result=new Intersection("No Intersection");for(var i=0;i<this.segments.length;i++){var inter=Intersection.intersectShapes(this.segments[i],shape);result.appendPoints(inter.points);}if(result.points.length>0)result.status="Intersection";return result;};
Path.prototype.getIntersectionParams=function(){return new IntersectionParams("Path",[]);};
function AbsolutePathSegment(command,params,owner,previous){if(arguments.length>0)this.init(command,params,owner,previous);};
AbsolutePathSegment.prototype.init=function(command,params,owner,previous){this.command=command;this.owner=owner;this.previous=previous;this.handles=new Array();var index=0;while(index<params.length){var handle=new Handle(params[index],params[index+1],owner);this.handles.push(handle);index+=2;}};
AbsolutePathSegment.prototype.realize=function(){for(var i=0;i<this.handles.length;i++){var handle=this.handles[i];handle.realize();handle.show(false);}};
AbsolutePathSegment.prototype.unrealize=function(){for(var i=0;i<this.handles.length;i++){this.handles[i].unrealize();}};
AbsolutePathSegment.prototype.registerHandles=function(){for(var i=0;i<this.handles.length;i++){mouser.register(this.handles[i]);}};
AbsolutePathSegment.prototype.unregisterHandles=function(){for(var i=0;i<this.handles.length;i++){mouser.unregister(this.handles[i]);}};
AbsolutePathSegment.prototype.selectHandles=function(select){for(var i=0;i<this.handles.length;i++){this.handles[i].select(select);}};
AbsolutePathSegment.prototype.showHandles=function(state){for(var i=0;i<this.handles.length;i++){this.handles[i].show(state);}};
AbsolutePathSegment.prototype.toString=function(){var points=new Array();var command="";if(this.previous==null||this.previous.constructor!=this.constuctor)command=this.command;for(var i=0;i<this.handles.length;i++){points.push(this.handles[i].point.toString());}return command+points.join(" ");};
AbsolutePathSegment.prototype.getLastPoint=function(){return this.handles[this.handles.length-1].point;};
AbsolutePathSegment.prototype.getIntersectionParams=function(){return null;};
AbsoluteArcPath.prototype=new AbsolutePathSegment();
AbsoluteArcPath.prototype.constructor=AbsoluteArcPath;
AbsoluteArcPath.superclass=AbsolutePathSegment.prototype;
function AbsoluteArcPath(params,owner,previous){if(arguments.length>0){this.init("A",params,owner,previous);}}
AbsoluteArcPath.prototype.init=function(command,params,owner,previous){var point=new Array();var y=params.pop();var x=params.pop();point.push(x,y);AbsoluteArcPath.superclass.init.call(this,command,point,owner,previous);this.rx=parseFloat(params.shift());this.ry=parseFloat(params.shift());this.angle=parseFloat(params.shift());this.arcFlag=parseFloat(params.shift());this.sweepFlag=parseFloat(params.shift());};
AbsoluteArcPath.prototype.toString=function(){var points=new Array();var command="";if(this.previous.constructor!=this.constuctor)command=this.command;return command+[this.rx,this.ry,this.angle,this.arcFlag,this.sweepFlag,this.handles[0].point.toString()].join(",");};
AbsoluteArcPath.prototype.getIntersectionParams=function(){return new IntersectionParams("Ellipse",[this.getCenter(),this.rx,this.ry]);};
AbsoluteArcPath.prototype.getCenter=function(){var startPoint=this.previous.getLastPoint();var endPoint=this.handles[0].point;var rx=this.rx;var ry=this.ry;var angle=this.angle*Math.PI/180;var c=Math.cos(angle);var s=Math.sin(angle);var TOLERANCE=1e-6;var halfDiff=startPoint.subtract(endPoint).divide(2);var x1p=halfDiff.x*c+halfDiff.y*s;var y1p=halfDiff.x*-s+halfDiff.y*c;var x1px1p=x1p*x1p;var y1py1p=y1p*y1p;var lambda=(x1px1p/ (rx*rx) ) + ( y1py1p /(ry*ry));if(lambda>1){var factor=Math.sqrt(lambda);rx*=factor;ry*=factor;}var rxrx=rx*rx;var ryry=ry*ry;var rxy1=rxrx*y1py1p;var ryx1=ryry*x1px1p;var factor=(rxrx*ryry-rxy1-ryx1)/(rxy1+ryx1);if(Math.abs(factor)<TOLERANCE)factor=0;var sq=Math.sqrt(factor);if(this.arcFlag==this.sweepFlag)sq=-sq;var mid=startPoint.add(endPoint).divide(2);var cxp=sq*rx*y1p/ry;var cyp=sq*-ry*x1p/rx;return new Point2D(cxp*c-cyp*s+mid.x,cxp*s+cyp*c+mid.y);};
AbsoluteCurveto2.prototype=new AbsolutePathSegment();
AbsoluteCurveto2.prototype.constructor=AbsoluteCurveto2;
AbsoluteCurveto2.superclass=AbsolutePathSegment.prototype;
function AbsoluteCurveto2(params,owner,previous){if(arguments.length>0){this.init("Q",params,owner,previous);}}
AbsoluteCurveto2.prototype.getControlPoint=function(){return this.handles[0].point;};
AbsoluteCurveto2.prototype.getIntersectionParams=function(){return new IntersectionParams("Bezier2",[this.previous.getLastPoint(),this.handles[0].point,this.handles[1].point]);};
AbsoluteCurveto3.prototype=new AbsolutePathSegment();
AbsoluteCurveto3.prototype.constructor=AbsoluteCurveto3;
AbsoluteCurveto3.superclass=AbsolutePathSegment.prototype;
function AbsoluteCurveto3(params,owner,previous){if(arguments.length>0){this.init("C",params,owner,previous);}}
AbsoluteCurveto3.prototype.getLastControlPoint=function(){return this.handles[1].point;};
AbsoluteCurveto3.prototype.getIntersectionParams=function(){return new IntersectionParams("Bezier3",[this.previous.getLastPoint(),this.handles[0].point,this.handles[1].point,this.handles[2].point]);};
AbsoluteHLineto.prototype=new AbsolutePathSegment();
AbsoluteHLineto.prototype.constructor=AbsoluteHLineto;
AbsoluteHLineto.superclass=AbsolutePathSegment.prototype;
function AbsoluteHLineto(params,owner,previous){if(arguments.length>0){this.init("H",params,owner,previous);}}
AbsoluteHLineto.prototype.init=function(command,params,owner,previous){var prevPoint=previous.getLastPoint();var point=new Array();point.push(params.pop(),prevPoint.y);AbsoluteHLineto.superclass.init.call(this,command,point,owner,previous);};
AbsoluteHLineto.prototype.toString=function(){var points=new Array();var command="";if(this.previous.constructor!=this.constuctor)command=this.command;return command+this.handles[0].point.x;};
AbsoluteLineto.prototype=new AbsolutePathSegment();
AbsoluteLineto.prototype.constructor=AbsoluteLineto;
AbsoluteLineto.superclass=AbsolutePathSegment.prototype;
function AbsoluteLineto(params,owner,previous){if(arguments.length>0){this.init("L",params,owner,previous);}}
AbsoluteLineto.prototype.toString=function(){var points=new Array();var command="";if(this.previous.constructor!=this.constuctor)if(this.previous.constructor!=AbsoluteMoveto)command=this.command;return command+this.handles[0].point.toString();};
AbsoluteLineto.prototype.getIntersectionParams=function(){return new IntersectionParams("Line",[this.previous.getLastPoint(),this.handles[0].point]);};
AbsoluteMoveto.prototype=new AbsolutePathSegment();
AbsoluteMoveto.prototype.constructor=AbsoluteMoveto;
AbsoluteMoveto.superclass=AbsolutePathSegment.prototype;
function AbsoluteMoveto(params,owner,previous){if(arguments.length>0){this.init("M",params,owner,previous);}}
AbsoluteMoveto.prototype.toString=function(){return"M"+this.handles[0].point.toString();};
AbsoluteSmoothCurveto2.prototype=new AbsolutePathSegment();
AbsoluteSmoothCurveto2.prototype.constructor=AbsoluteSmoothCurveto2;
AbsoluteSmoothCurveto2.superclass=AbsolutePathSegment.prototype;
function AbsoluteSmoothCurveto2(params,owner,previous){if(arguments.length>0){this.init("T",params,owner,previous);}}
AbsoluteSmoothCurveto2.prototype.getControlPoint=function(){var lastPoint=this.previous.getLastPoint();var point;if(this.previous.command.match(/^[QqTt]$/)){var ctrlPoint=this.previous.getControlPoint();var diff=ctrlPoint.subtract(lastPoint);point=lastPoint.subtract(diff);}else{point=lastPoint;}return point;};
AbsoluteSmoothCurveto2.prototype.getIntersectionParams=function(){return new IntersectionParams("Bezier2",[this.previous.getLastPoint(),this.getControlPoint(),this.handles[0].point]);};
AbsoluteSmoothCurveto3.prototype=new AbsolutePathSegment();
AbsoluteSmoothCurveto3.prototype.constructor=AbsoluteSmoothCurveto3;
AbsoluteSmoothCurveto3.superclass=AbsolutePathSegment.prototype;
function AbsoluteSmoothCurveto3(params,owner,previous){if(arguments.length>0){this.init("S",params,owner,previous);}}
AbsoluteSmoothCurveto3.prototype.getFirstControlPoint=function(){var lastPoint=this.previous.getLastPoint();var point;if(this.previous.command.match(/^[SsCc]$/)){var lastControl=this.previous.getLastControlPoint();var diff=lastControl.subtract(lastPoint);point=lastPoint.subtract(diff);}else{point=lastPoint;}return point;};
AbsoluteSmoothCurveto3.prototype.getLastControlPoint=function(){return this.handles[0].point;};
AbsoluteSmoothCurveto3.prototype.getIntersectionParams=function(){return new IntersectionParams("Bezier3",[this.previous.getLastPoint(),this.getFirstControlPoint(),this.handles[0].point,this.handles[1].point]);};
RelativePathSegment.prototype=new AbsolutePathSegment();
RelativePathSegment.prototype.constructor=RelativePathSegment;
RelativePathSegment.superclass=AbsolutePathSegment.prototype;
function RelativePathSegment(command,params,owner,previous){if(arguments.length>0)this.init(command,params,owner,previous);}
RelativePathSegment.prototype.init=function(command,params,owner,previous){this.command=command;this.owner=owner;this.previous=previous;this.handles=new Array();var lastPoint;if(this.previous)lastPoint=this.previous.getLastPoint();else lastPoint=new Point2D(0,0);var index=0;while(index<params.length){var handle=new Handle(lastPoint.x+params[index],lastPoint.y+params[index+1],owner);this.handles.push(handle);index+=2;}};
RelativePathSegment.prototype.toString=function(){var points=new Array();var command="";var lastPoint;if(this.previous)lastPoint=this.previous.getLastPoint();else lastPoint=new Point2D(0,0);if(this.previous==null||this.previous.constructor!=this.constructor)command=this.command;for(var i=0;i<this.handles.length;i++){var point=this.handles[i].point.subtract(lastPoint);points.push(point.toString());}return command+points.join(" ");};
RelativeClosePath.prototype=new RelativePathSegment();
RelativeClosePath.prototype.constructor=RelativeClosePath;
RelativeClosePath.superclass=RelativePathSegment.prototype;
function RelativeClosePath(params,owner,previous){if(arguments.length>0){this.init("z",params,owner,previous);}}
RelativeClosePath.prototype.getLastPoint=function(){var current=this.previous;var point;while(current){if(current.command.match(/^[mMzZ]$/)){point=current.getLastPoint();break;}current=current.previous;}return point;};
RelativeClosePath.prototype.getIntersectionParams=function(){return new IntersectionParams("Line",[this.previous.getLastPoint(),this.getLastPoint()]);};
RelativeCurveto2.prototype=new RelativePathSegment();
RelativeCurveto2.prototype.constructor=RelativeCurveto2;
RelativeCurveto2.superclass=RelativePathSegment.prototype;
function RelativeCurveto2(params,owner,previous){if(arguments.length>0){this.init("q",params,owner,previous);}}
RelativeCurveto2.prototype.getControlPoint=function(){return this.handles[0].point;};
RelativeCurveto2.prototype.getIntersectionParams=function(){return new IntersectionParams("Bezier2",[this.previous.getLastPoint(),this.handles[0].point,this.handles[1].point]);};
RelativeCurveto3.prototype=new RelativePathSegment();
RelativeCurveto3.prototype.constructor=RelativeCurveto3;
RelativeCurveto3.superclass=RelativePathSegment.prototype;
function RelativeCurveto3(params,owner,previous){if(arguments.length>0){this.init("c",params,owner,previous);}}
RelativeCurveto3.prototype.getLastControlPoint=function(){return this.handles[1].point;};
RelativeCurveto3.prototype.getIntersectionParams=function(){return new IntersectionParams("Bezier3",[this.previous.getLastPoint(),this.handles[0].point,this.handles[1].point,this.handles[2].point]);};
RelativeLineto.prototype=new RelativePathSegment();
RelativeLineto.prototype.constructor=RelativeLineto;
RelativeLineto.superclass=RelativePathSegment.prototype;
function RelativeLineto(params,owner,previous){if(arguments.length>0){this.init("l",params,owner,previous);}}
RelativeLineto.prototype.toString=function(){var points=new Array();var command="";var lastPoint;var point;if(this.previous)lastPoint=this.previous.getLastPoint();else lastPoint=new Point(0,0);point=this.handles[0].point.subtract(lastPoint);if(this.previous.constructor!=this.constuctor)if(this.previous.constructor!=RelativeMoveto)cmd=this.command;return cmd+point.toString();};
RelativeLineto.prototype.getIntersectionParams=function(){return new IntersectionParams("Line",[this.previous.getLastPoint(),this.handles[0].point]);};
RelativeMoveto.prototype=new RelativePathSegment();
RelativeMoveto.prototype.constructor=RelativeMoveto;
RelativeMoveto.superclass=RelativePathSegment.prototype;
function RelativeMoveto(params,owner,previous){if(arguments.length>0){this.init("m",params,owner,previous);}}
RelativeMoveto.prototype.toString=function(){return"m"+this.handles[0].point.toString();};
RelativeSmoothCurveto2.prototype=new RelativePathSegment();
RelativeSmoothCurveto2.prototype.constructor=RelativeSmoothCurveto2;
RelativeSmoothCurveto2.superclass=RelativePathSegment.prototype;
function RelativeSmoothCurveto2(params,owner,previous){if(arguments.length>0){this.init("t",params,owner,previous);}}
RelativeSmoothCurveto2.prototype.getControlPoint=function(){var lastPoint=this.previous.getLastPoint();var point;if(this.previous.command.match(/^[QqTt]$/)){var ctrlPoint=this.previous.getControlPoint();var diff=ctrlPoint.subtract(lastPoint);point=lastPoint.subtract(diff);}else{point=lastPoint;}return point;};
RelativeSmoothCurveto2.prototype.getIntersectionParams=function(){return new IntersectionParams("Bezier2",[this.previous.getLastPoint(),this.getControlPoint(),this.handles[0].point]);};
RelativeSmoothCurveto3.prototype=new RelativePathSegment();
RelativeSmoothCurveto3.prototype.constructor=RelativeSmoothCurveto3;
RelativeSmoothCurveto3.superclass=RelativePathSegment.prototype;
function RelativeSmoothCurveto3(params,owner,previous){if(arguments.length>0){this.init("s",params,owner,previous);}}
RelativeSmoothCurveto3.prototype.getFirstControlPoint=function(){var lastPoint=this.previous.getLastPoint();var point;if(this.previous.command.match(/^[SsCc]$/)){var lastControl=this.previous.getLastControlPoint();var diff=lastControl.subtract(lastPoint);point=lastPoint.subtract(diff);}else{point=lastPoint;}return point;};
RelativeSmoothCurveto3.prototype.getLastControlPoint=function(){return this.handles[0].point;};
RelativeSmoothCurveto3.prototype.getIntersectionParams=function(){return new IntersectionParams("Bezier3",[this.previous.getLastPoint(),this.getFirstControlPoint(),this.handles[0].point,this.handles[1].point]);};
Polygon.prototype=new Shape();
Polygon.prototype.constructor=Polygon;
Polygon.superclass=Shape.prototype;
function Polygon(svgNode){if(arguments.length>0){this.init(svgNode);}}
Polygon.prototype.init=function(svgNode){if(svgNode.localName=="polygon"){Polygon.superclass.init.call(this,svgNode);var points=svgNode.getAttributeNS(null,"points").split(/[\s,]+/);this.handles=new Array();for(var i=0;i<points.length;i+=2){var x=parseFloat(points[i]);var y=parseFloat(points[i+1]);this.handles.push(new Handle(x,y,this));}}else{throw new Error("Polygon.init: Invalid SVG Node: "+svgNode.localName);}};
Polygon.prototype.realize=function(){if(this.svgNode!=null){for(var i=0;i<this.handles.length;i++){this.handles[i].realize();this.handles[i].show(false);}mouser.addEvent("press",this.svgNode,this);}};
Polygon.prototype.unrealize=function(){if(this.svgNode!=null){for(var i=0;i<this.handles.length;i++)this.handles[i].unrealize();}mouser.removeEvent("press",this.svgNode,this);};
Polygon.prototype.refresh=function(){var points=new Array();for(var i=0;i<this.handles.length;i++){points.push(this.handles[i].point.toString());}this.svgNode.setAttributeNS(null,"points",points.join(" "));};
Polygon.prototype.registerHandles=function(){for(var i=0;i<this.handles.length;i++)mouser.register(this.handles[i]);};
Polygon.prototype.unregisterHandles=function(){for(var i=0;i<this.handles.length;i++)mouser.unregister(this.handles[i]);};
Polygon.prototype.selectHandles=function(select){for(var i=0;i<this.handles.length;i++)this.handles[i].select(select);};
Polygon.prototype.showHandles=function(state){for(var i=0;i<this.handles.length;i++)this.handles[i].show(state);};
Polygon.prototype.pointInPolygon=function(point){var length=this.handles.length;var counter=0;var x_inter;var p1=this.handles[0].point;for(var i=1;i<=length;i++){var p2=this.handles[i%length].point;if(point.y>Math.min(p1.y,p2.y)){if(point.y<=Math.max(p1.y,p2.y)){if(point.x<=Math.max(p1.x,p2.x)){if(p1.y!=p2.y){x_inter=(point.y-p1.y)*(p2.x-p1.x)/(p2.y-p1.y)+p1.x;if(p1.x==p2.x||point.x<=x_inter){counter++;}}}}}p1=p2;}return(counter%2==1);};
Polygon.prototype.getIntersectionParams=function(){var points=new Array();for(var i=0;i<this.handles.length;i++){points.push(this.handles[i].point);}return new IntersectionParams("Polygon",[points]);};
Polygon.prototype.getArea=function(){var area=0;var length=this.handles.length;var neg=0;var pos=0;for(var i=0;i<length;i++){var h1=this.handles[i].point;var h2=this.handles[(i+1)%length].point;area+=(h1.x*h2.y-h2.x*h1.y);}return area/2;};
Polygon.prototype.getCentroid=function(){var length=this.handles.length;var area6x=6*this.getArea();var x_sum=0;var y_sum=0;for(var i=0;i<length;i++){var p1=this.handles[i].point;var p2=this.handles[(i+1)%length].point;var cross=(p1.x*p2.y-p2.x*p1.y);x_sum+=(p1.x+p2.x)*cross;y_sum+=(p1.y+p2.y)*cross;}return new Point2D(x_sum/ area6x, y_sum /area6x);};
Polygon.prototype.isClockwise=function(){return this.getArea()<0;};
Polygon.prototype.isCounterClockwise=function(){return this.getArea()>0;};
Polygon.prototype.isConcave=function(){var positive=0;var negative=0;var length=this.handles.length;for(var i=0;i<length;i++){var p0=this.handles[i].point;var p1=this.handles[(i+1)%length].point;var p2=this.handles[(i+2)%length].point;var v0=Vector2D.fromPoints(p0,p1);var v1=Vector2D.fromPoints(p1,p2);var cross=v0.cross(v1);if(cross<0){negative++;}else{positive++;}}return(negative!=0&&positive!=0);};
Polygon.prototype.isConvex=function(){return!this.isConcave();};
Rectangle.prototype=new Shape();
Rectangle.prototype.constructor=Rectangle;
Rectangle.superclass=Shape.prototype;
function Rectangle(svgNode){if(arguments.length>0){this.init(svgNode);}}
Rectangle.prototype.init=function(svgNode){if(svgNode.localName=="rect"){Rectangle.superclass.init.call(this,svgNode);var x=parseFloat(svgNode.getAttributeNS(null,"x"));var y=parseFloat(svgNode.getAttributeNS(null,"y"));var width=parseFloat(svgNode.getAttributeNS(null,"width"));var height=parseFloat(svgNode.getAttributeNS(null,"height"));this.p1=new Handle(x,y,this);this.p2=new Handle(x+width,y+height,this);}else{throw new Error("Rectangle.init: Invalid SVG Node: "+svgNode.localName);}};
Rectangle.prototype.realize=function(){if(this.svgNode!=null){this.p1.realize();this.p2.realize();this.p1.show(false);this.p2.show(false);mouser.addEvent("press",this.svgNode,this);}};
Rectangle.prototype.unrealize=function(){this.p1.unrealize();this.p2.unrealize();mouser.removeEvent("press",this.svgNode,this);};
Rectangle.prototype.refresh=function(){var min=this.p1.point.min(this.p2.point);var max=this.p1.point.max(this.p2.point);this.svgNode.setAttributeNS(null,"x",min.x);this.svgNode.setAttributeNS(null,"y",min.y);this.svgNode.setAttributeNS(null,"width",max.x-min.x);this.svgNode.setAttributeNS(null,"height",max.y-min.y);};
Rectangle.prototype.registerHandles=function(){mouser.register(this.p1);mouser.register(this.p2);};
Rectangle.prototype.unregisterHandles=function(){mouser.unregister(this.p1);mouser.unregister(this.p2);};
Rectangle.prototype.selectHandles=function(select){this.p1.select(select);this.p2.select(select);};
Rectangle.prototype.showHandles=function(state){this.p1.show(state);this.p2.show(state);};
Rectangle.prototype.getIntersectionParams=function(){return new IntersectionParams("Rectangle",[this.p1.point,this.p2.point]);};
/*****
*
*   Transform.js
*
*   copyright 2020 Robert Beach
*
*****/

/*****
*
*   Setup inheritance
*
*****/
Transform.prototype             = new Shape();
Transform.prototype.constructor = Transform;
Transform.superclass            = Shape.prototype;


/*****
*
*   constructor
*
*****/
function Transform(svgNode,rect,hideLock) {
    if ( arguments.length > 0 ) {
        this.init(svgNode,rect,hideLock);
    }
}


/*****
*
*   init
*
*****/
Transform.prototype.init = function(target,rect,hideLock) {
        this.target = target;
        this.id = target.id;
        this.hideLock = hideLock;

        //flags
        this.toggleHandles = true;
        this.handlesSelected = false;
        this.lockSelection=false;
        this.dragged=false;

        var x,y,w,h,b;
        if(Array.isArray(target)){
            this.m=[];
            for(var i = 0;i<target.length;i++){
                var transform = target[i].getAttributeNS(null,"transform");
                if(transform){
                    var el = transform.substr(7, transform.length-2).split(/[\s,]+/);
                    this.m.push( [[parseFloat( el[0]   ),parseFloat( el[2]   ),parseFloat( el[4]   )],[parseFloat( el[1]   ),parseFloat( el[3]   ),parseFloat( el[5]   )],[0,0,1]] );
                }else{
                    this.m.push( [[1,0,0],[0,1,0],[0,0,1]] );
                }
            }

            x = (rect.x+window.scrollX)/Tools.scale;
            y = (rect.y+window.scrollY)/Tools.scale;
            w = (rect.x2-rect.x)/Tools.scale;
            h = (rect.y2-rect.y)/Tools.scale;
            b = (D2isTouch?20:10);
        }else{
            var transform = target.getAttributeNS(null,"transform");
            if(transform){
                var el = transform.substr(7, transform.length-2).split(/[\s,]+/);
                this.m = [[parseFloat( el[0]   ),parseFloat( el[2]   ),parseFloat( el[4]   )],[parseFloat( el[1]   ),parseFloat( el[3]   ),parseFloat( el[5]   )],[0,0,1]]
            }else{
                this.m = [[1,0,0],[0,1,0],[0,0,1]]
            }
            var box = target.getBoundingClientRect();
            Tools.adjustBox(target,box,this.m);

            var r2 = {};
			if(Tools.getMarkerBoundingRect(target,r2,this.m)){
                Tools.composeRects(box,r2);
			}

            x = (box.x+window.scrollX)/Tools.scale;
            y = (box.y+window.scrollY)/Tools.scale;
            w = box.width/Tools.scale;
            h = box.height/Tools.scale;
            b = (D2isTouch?20:10);
        }
        //init points
        this.points = [];
        this.points[0]= new Point2D(x-b,y-b);
        this.points[1]= new Point2D(x+w+b,y-b);
        this.points[2]= new Point2D(x+w+b,y+h+b);
        this.points[3]= new Point2D(x-b,y+h+b);

        // Build Frame
        var svgns="http://www.w3.org/2000/svg";
        var svgNode=document.createElementNS(svgns,"polygon");
        var points=[];
        for ( var i = 0; i < this.points.length; i++ ) {
            //console.log(this.points[i].toString());
            points.push( this.points[i].toString() );
        }
        svgNode.setAttributeNS(null, "points", points.join(" "));
        svgNode.setAttributeNS(null,"stroke-width",1);
        svgNode.setAttributeNS(null,"fill","gray");
        svgNode.setAttributeNS(null,"fill-opacity",.1);
        svgNode.setAttributeNS(null,"stroke","red");
        svg.appendChild(svgNode);

        // Call superclass method
        Transform.superclass.init.call(this, svgNode);
        
        //vector stuff and handles
        this.v1 = {x:this.points[1].x-this.points[0].x,y:this.points[1].y-this.points[0].y};
        this.v2 = {x:this.points[3].x-this.points[0].x,y:this.points[3].y-this.points[0].y};
        this.x = this.points[0].x;
        this.y = this.points[0].y;
        this.handles = new Array();
        
        x = this.points[1].x;
        y = (this.points[1].y  +  this.points[2].y )/2;
        this.handles.push( new Handle(x, y, this) );
        x = (this.points[2].x  +  this.points[3].x )/2;
        y = this.points[2].y;
        this.handles.push( new Handle(x, y, this) );
        this.handles.push( new Handle(x, this.points[0].y-20, this) );
        x =  this.points[2].x;
        y =  this.points[2].y;
        this.handles.push( new Handle(x, y, this) );
        
};


/*****
*
*   realize
*
*****/
Transform.prototype.realize = function() {
    if ( this.svgNode != null ) {
        for ( var i = 0; i < this.handles.length; i++ ) {
            this.handles[i].realize();
            this.handles[i].show(false);
        }
        mouser.addEvent("press",this.svgNode,this);
        //mouser.addEvent("click",this.svgNode,this);
        //mouser.addEvent("move",this.svgNode,this);
    }
};

Transform.prototype.unrealize=function(){
    if(this.svgNode!=null){for(var i=0;i<this.handles.length;i++)
        this.handles[i].unrealize();
    }
        mouser.removeEvent("press",this.svgNode,this);
        //mouser.removeEvent("click",this.svgNode,this);
        //mouser.removeEvent("move",this.svgNode,this);
        if(this.svgNode.parentNode)
            this.svgNode.parentNode.removeChild(this.svgNode);
    };


/*****
*
*   refresh
*
*****/
Transform.prototype.refresh = function() {
    this.dragged = true;
    var points = new Array();
    if(this.handles[0].selected&&this.handles[1].selected){
        var delta    = this.handles[3].point.subtract(this.points[2]);
        this.points[0].x += delta.x;
        this.points[0].y += delta.y;
        this.points[1].x += delta.x;
        this.points[1].y += delta.y;
        this.points[2].x += delta.x;
        this.points[2].y += delta.y;
        this.points[3].x += delta.x;
        this.points[3].y += delta.y;
    }else{
        var center = new Point2D((this.points[0].x+this.points[2].x)/2,(this.points[0].y+this.points[2].y)/2);
        if(this.handles[0].selected){
            var midpoint = new Point2D((this.points[1].x+this.points[2].x)/2,(this.points[1].y+this.points[2].y)/2);
            var delta    = this.handles[0].point.subtract(midpoint);
            this.points[1].x += delta.x;
            this.points[1].y += delta.y;
            this.points[2].x += delta.x;
            this.points[2].y += delta.y;
            this.handles[1].translate(new Point2D(delta.x/2,delta.y/2));
            this.handles[3].translate(delta);
        }else if(this.handles[1].selected){
            var midpoint = new Point2D((this.points[2].x+this.points[3].x)/2,(this.points[2].y+this.points[3].y)/2)
            var delta    = this.handles[1].point.subtract(midpoint);
            this.points[2].x += delta.x;
            this.points[2].y += delta.y;
            this.points[3].x += delta.x;
            this.points[3].y += delta.y;
            this.handles[0].translate(new Point2D(delta.x/2,delta.y/2));
            this.handles[3].translate(delta);
        }else if(this.handles[3].selected){
            var delta    = this.handles[3].point.subtract(this.points[2]);
            this.points[1].x += delta.x;
            this.points[3].y += delta.y;
            this.handles[0].translate(new Point2D(delta.x,delta.y/2));
            this.handles[1].translate(new Point2D(delta.x/2,delta.y));
            this.points[2].addEquals(delta);
        }else{
            var v1 = this.handles[1].point.subtract(center);
            var v2 = center.subtract(this.handles[2].point);
            
            var dot = v1.x*v2.x+v1.y*v2.y;
            var cross = v1.x*v2.y-v2.x*v1.y;
            var D = 1/Math.sqrt((v1.x*v1.x+v1.y*v1.y)*(v2.x*v2.x+v2.y*v2.y));
            var rot = [[dot,-cross],[cross,dot]];
            var rot = [[dot,-cross],[cross,dot]];
            for(var i = 0;i<4;i++){
                var v = this.points[i].subtract(center);
                var m = Tools.multiplyMatrices(rot,[[v.x],[v.y]]);
                this.points[i].x=m[0][0]*D+center.x;
                this.points[i].y=m[1][0]*D+center.y;
                if(i!=2){
                    var v = this.handles[i].point.subtract(center);
                    var m = Tools.multiplyMatrices(rot,[[v.x],[v.y]]);
                    this.handles[i].point.x=m[0][0]*D+center.x;
                    this.handles[i].point.y=m[1][0]*D+center.y;
                    this.handles[i].refresh();
                }
            }
        }
        var v = this.handles[1].point.subtract(center);           
        var v2 = new Point2D(v.x*-1.2,v.y*-1.2)
        this.handles[2].point.x=v2.x+center.x;
        this.handles[2].point.y=v2.y+center.y;
        this.handles[2].refresh();
    }
    
    for ( var i = 0; i < this.points.length; i++ ) {
        points.push( this.points[i].toString() );
    }
    
   this.svgNode.setAttributeNS(null, "points", points.join(" "));
   var m = this.generateTransformMatrix();
    if(Array.isArray(this.target)){
        this.matrix=[];
        for(var i = 0;i<this.target.length;i++){
            this.matrix.push(this.updateMatrix(m,true,i));
            this.target[i].setAttribute("transform", this.matrix[i]);
        }
    }else{
        this.matrix = this.updateMatrix(m,false);
        this.target.setAttribute("transform", this.matrix);
    }
};

Transform.prototype.generateTransformMatrix = function(){
    var v1 = {x:this.points[1].x-this.points[0].x,y:this.points[1].y-this.points[0].y};
    var v2 = {x:this.points[3].x-this.points[0].x,y:this.points[3].y-this.points[0].y};
    var D = this.v1.x*this.v2.y-this.v2.x*this.v1.y;
    if(D==0)D=.0000001;
    var Da = v1.x*this.v2.y-v2.x*this.v1.y;
    var Db = v1.y*this.v2.y-v2.y*this.v1.y;
    var Dc = v2.x*this.v1.x-v1.x*this.v2.x;
    var Dd = v2.y*this.v1.x-v1.y*this.v2.x;
    return [[Da/D,Dc/D,(-Da/D*this.x-Dc/D*this.y+this.points[0].x)],[Db/D,Dd/D,(-Db/D*this.x-Dd/D*this.y+this.points[0].y)]]
};


Transform.prototype.updateMatrix = function(m,multiple,i){
    var prod;
    if(multiple) {
        prod = Tools.multiplyMatrices(m,this.m[i]);
     } else{
        prod = Tools.multiplyMatrices(m,this.m);
    }
    return "matrix(" + prod[0][0] + " "  + prod[1][0] + " " + prod[0][1] + " " + prod[1][1] + " " + prod[0][2] + " " + prod[1][2] + ")";
};


/*****
*
*   registerHandles
*
*****/
Transform.prototype.registerHandles = function() {
    for ( var i = 0; i < this.handles.length; i++ )
        mouser.register( this.handles[i] );
};


/*****
*
*   unregisterHandles
*
*****/
Transform.prototype.unregisterHandles = function() {
    for ( var i = 0; i < this.handles.length; i++ )
        mouser.unregister( this.handles[i] );
};


/*****
*
*   selectHandles
*
*****/
Transform.prototype.selectHandles = function(select) {
    for ( var i = 0; i < this.handles.length; i++ )
        this.handles[i].select(select);
};


/*****
*
*   showHandles
*
*****/
Transform.prototype.showHandles = function(state) {
    for ( var i = 0; i < this.handles.length; i++ )
        this.handles[i].show(state);
    
};


Transform.prototype.select = function(state){
    if(!state){
        var display = ( state ) ? "inline" : "none";
        this.visible = state;
        this.svgNode.setAttributeNS(null, "display", display);
        if(this.hideLock)
            this.hideLock();
    };
    Transform.superclass.select.call(this, state);
}

Transform.prototype.handleMouseDown = function(){
    if(Array.isArray(this.target)){
        if(wb_comp.list["Measurement"]){
            wb_comp.list["Measurement"].updateTransform(
                this
            )
        }   
    }else{
        if(wb_comp.list["Measurement"]){
            wb_comp.list["Measurement"].updateTransform(
            )
        } 
    }
}

