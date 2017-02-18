/* See license.txt for terms of usage */

define("domplate/domTree",["domplate/domplate","core/lib","core/trace"],function(Domplate,Lib,Trace){with(Domplate){function DomTree(e){this.input=e}DomTree.prototype=domplate({tag:TABLE({"class":"domTable",cellpadding:0,cellspacing:0,onclick:"$onClick"},TBODY(FOR("member","$object|memberIterator",TAG("$member|getRowTag",{member:"$member"})))),rowTag:TR({"class":"memberRow $member.open $member.type\\Row $member|hasChildren",$hasChildren:"$member|hasChildren",_repObject:"$member",level:"$member.level"},TD({"class":"memberLabelCell",style:"padding-left: $member.indent\\px"},SPAN({"class":"memberLabel $member.type\\Label"},"$member.name")),TD({"class":"memberValueCell"},TAG("$member.tag",{object:"$member|getValue"}))),loop:FOR("member","$members",TAG("$member|getRowTag",{member:"$member"})),hasChildren:function(e){return e.hasChildren?"hasChildren":""},memberIterator:function(e){return this.getMembers(e)},getValue:function(e){return e.value},getRowTag:function(e){return this.rowTag},onClick:function(e){var t=Lib.fixEvent(e);if(!Lib.isLeftClick(t))return;var n=Lib.getAncestorByClass(t.target,"memberRow"),r=Lib.getAncestorByClass(t.target,"memberLabel");r&&Lib.hasClass(n,"hasChildren")&&this.toggleRow(n)},toggleRow:function(e,t){if(!e)return;var n=parseInt(e.getAttribute("level"));if(t&&Lib.hasClass(e,"opened"))return;if(Lib.hasClass(e,"opened")){Lib.removeClass(e,"opened");var r=e.parentNode;for(var i=e.nextSibling;i;i=e.nextSibling){if(parseInt(i.getAttribute("level"))<=n)break;r.removeChild(i)}}else{Lib.setClass(e,"opened");var s=e.repObject;if(s){if(!s.hasChildren)return;var o=this.getMembers(s.value,n+1);o&&this.loop.insertRows({members:o},e)}}},getMembers:function(e,t){t||(t=0);var n=[];for(var r in e){var i=e[r];typeof i!="function"&&n.push(this.createMember("dom",r,i,t))}return n},createMember:function(e,t,n,r){var i=typeof n,s=this.hasProperties(n)&&i=="object",o=DomTree.Reps.getRep(n);return{name:t,value:n,type:e,rowClass:"memberRow-"+e,open:"",level:r,indent:r*16,hasChildren:s,tag:o.tag}},hasProperties:function(e){if(typeof e=="string")return!1;try{for(var t in e)return!0}catch(n){}return!1},append:function(e){this.element=this.tag.append({object:this.input},e),this.element.repObject=this;var t=Lib.isArray(this.input)&&this.input.length>2,n=this.element.firstChild.firstChild;n&&!t&&this.toggleRow(n)},expandRow:function(e){var t=this.getRow(e);return this.toggleRow(t,!0),t},getRow:function(e){if(!this.element)return;var t=Lib.getElementsByClass(this.element,"memberRow");for(var n=0;n<t.length;n++){var r=t[n];if(r.repObject.value==e)return r}return null}});function safeToString(e){try{return e.toString()}catch(t){return""}}var OBJECTBOX=DIV({"class":"objectBox objectBox-$className"});DomTree.Reps={reps:[],registerRep:function(){this.reps.push.apply(this.reps,arguments)},getRep:function(e){var t=typeof e;t=="object"&&e instanceof String&&(t="string");for(var n=0;n<this.reps.length;++n){var r=this.reps[n];try{if(r.supportsObject(e,t))return r}catch(i){Trace.exception("domTree.getRep; ",i)}}return DomTree.Rep}},DomTree.Rep=domplate({tag:OBJECTBOX("$object|getTitle"),className:"object",getTitle:function(e){var t=safeToString(e),n=/\[object (.*?)\]/,r=n.exec(t);return r?r[1]:t},getTooltip:function(e){return null},supportsObject:function(e,t){return!1}}),DomTree.Reps.Null=domplate(DomTree.Rep,{tag:OBJECTBOX("null"),className:"null",supportsObject:function(e,t){return e==null}}),DomTree.Reps.Number=domplate(DomTree.Rep,{tag:OBJECTBOX("$object"),className:"number",supportsObject:function(e,t){return t=="boolean"||t=="number"}}),DomTree.Reps.String=domplate(DomTree.Rep,{tag:OBJECTBOX("$object"),className:"string",supportsObject:function(e,t){return t=="string"}}),DomTree.Reps.Arr=domplate(DomTree.Rep,{tag:OBJECTBOX("$object|getTitle"),className:"array",supportsObject:function(e,t){return Lib.isArray(e)},getTitle:function(e){return"Array ["+e.length+"]"}}),DomTree.Reps.Tree=domplate(DomTree.Rep,{tag:OBJECTBOX(TAG("$object|getTag",{object:"$object|getRoot"})),className:"tree",getTag:function(e){return Tree.tag},getRoot:function(e){return[e]},supportsObject:function(e,t){return t=="object"}});var Tree=domplate(DomTree.prototype,{createMember:function(e,t,n,r){var i=DomTree.prototype.createMember(e,t,n,r);return r==0&&(i.name="",i.type="tableCell"),i}});return DomTree.Reps.registerRep(DomTree.Reps.Null,DomTree.Reps.Number,DomTree.Reps.String,DomTree.Reps.Arr),DomTree}});