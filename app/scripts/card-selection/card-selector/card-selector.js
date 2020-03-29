const PROGRESS_LOAD=1,PROGRESS_SETS=2,PROGRESS_SETS_TOTAL=4,PROGRESS_CARDS=6,POTION_FACTOR=[0,2,1,0,-1];function closeWithError(e){postMessage({result:"error",message:e})}function generateCards(e,a,t){var r=[],o={},s=0;for(set of e.sets){var n=set.toLowerCase().replace(" ","")+".xml",c=e.appDir+"/app/data/cards/"+n,p=new marknote.Parser,l=p.parseURL(c,null,"GET");if(200===p.getXHRStatus()){var d=l.getRootElement(),i=d.getAttributeValue("name"),h=d.getChildElements();for(xmlSet of h){var f=xmlSet.getAttributeValue("version"),g=e[i+f];if(""===f||"on"===g){var m=xmlSet.getChildElements("card");for(xmlCard of m)cardData=xmlToCardData(xmlCard,i),r.push(cardData),void 0===o[cardData.cost]&&(o[cardData.cost]=0),o[cardData.cost]+=1}}}else closeWithError("There was a problem parsing the cards for "+set);s+=1;var u=Math.round(s*PROGRESS_SETS_TOTAL/e.sets.length);postMessage({result:"progress",progress:PROGRESS_SETS+u-1})}postMessage({result:"progress",progress:PROGRESS_SETS+PROGRESS_SETS_TOTAL}),generateKingdom(e,a,r,o,t)}function generateKingdom(e,a,r,o,s){var n=[],c="",p=!1,l=void 0,d=10,i=0,h=0,f=0;for(0===r.length&&closeWithError("No sets were selected");n.length<d;){var g="",m=findTypeChances(n,r,a),u=0;for(typeChance of m)u+=typeChance.chance;var v=e.randomness;if((void 0===v||v<.001)&&(v=.001),0===r.length)closeWithError("Not enough cards are in the selected sets");else{var y=void 0,S=void 0;if(u<=Math.random()*v||Math.random()<=.001||f>=1e3)g+=(y=r[S=Math.floor(Math.random()*r.length)]).cardName+" chosen at random\n\n";else{var C=Math.random()*u,M=void 0,T=void 0,E=0;for(typeChance of m)void 0===M&&(E+=typeChance.chance)>=C&&(M=typeChance.cardType,typeChance.chance,T=typeChance.c1);if(void 0!==M){var R=[];for(Y=0;Y<r.length;++Y){var b=r[Y];for(t of b.types)if(t===M){var w={card:b,i:Y};R.push(w)}}(S=Math.floor(Math.random()*R.length))>r.length-1&&(S=r.length-1);var O=(w=R[S]).card,P=0,N=0,A=0;for(Y=0;Y<n.length;++Y){b=n[Y];var D=0;for(t1 of b.types)for(t2 of O.types)if(t1===t2){var L=!1;for(it of s)t1===it&&(L=!0);L||(D+=1)}P+=D/(Math.sqrt(b.types.length)+Math.sqrt(O.types.length)),b.cost===O.cost&&"potion"!==b.altCost&&"potion"!==O.altCost&&(N+=1),b.cost===O.cost&&"potion"===b.altCost&&"potion"===O.altCost&&(N+=2),b.cardSet===O.cardSet&&(A+=1)}var k=!0,x=Math.pow(N,2)*(Math.pow(Math.abs(O.cost-3),.5)+1);if(0===N?x-=.3:N>=3&&(x+=.2*Math.pow(N,2),N>=5&&(k=!1)),P+=x/Math.pow(o[O.cost],.75)/Math.pow(n.length,.35),e.distributeSets)if(e.sets.length>1)P+=Math.pow(A,2)/Math.pow(n.length,1.2)*.5;if(e.clusterPotions){var _=POTION_FACTOR[i];void 0===_&&(_=-10)}if("potion"===O.altCost?0===i?(n.length-h>=7&&(k=!1),P+=.2):P-=_:_>0&&(P+=.75*_),"Event"===O.cardType||"Landmark"===O.cardType)P+=Math.pow(r.length,.02)-1;var G=[];for(b of n)for(t of b.types)t==T&&G.push(b.cardName);if(P-=Math.pow(n.length,.5)*Math.pow(u,.5)*.001,k&&P<.9*Math.random()+.4){y=O,S=w.i;var j="'"+M+"' ("+y.cardName+")",X="'"+T+"' ("+G.join(", ")+")";"all"===e.debug&&console.log(y.cardName+" chosen : "+P.toFixed(2)),g+=j+" chosen because of "+X+"\n    similarity: "+P.toFixed(2)+"\n\n"}else f+=1,"all"===e.debug&&(k?console.log(O.cardName+" rejected : "+P.toFixed(2)):console.log(O.cardName+" rejected because invalid"))}}if(void 0!==y){var W=!1;if(p)"2"===y.cost||"3"===y.cost?"potion"!==y.altCost?"Event"!==y.cardType&&"Landmark"!==y.cardType?(l=y,p=!1,W=!0,g+=y.cardName+" chosen as bane for Young Witch\n\n"):c+=y.cardName+" rejected as bane due to card type\n\n":c+=y.cardName+" rejected as bane due to potion\n\n":c+=y.cardName+" rejected as bane due to cost\n\n";else{if("Young Witch"===y.cardName){d+=1;var B=[];for(pBane of n)"2"!==pBane.cost&&"3"!==pBane.cost||"potion"!==pBane.altCost&&"Event"!==pBane.cardType&&"Landmark"!==pBane.cardType&&B.push(pBane);if(B.length>0)g+=(l=B[Math.floor(Math.random()*B.length)]).cardName+" chosen as bane for Young Witch\n\n";else p=!0}W=!0}"Event"!==y.cardType&&"Landmark"!==y.cardType||h>=2&&(W=!1),W&&(n.push(y),r.splice(S,1),"potion"===y.altCost&&(i+=1),"Event"!==y.cardType&&"Landmark"!==y.cardType||(d+=1,h+=1),c+=g),postMessage({result:"progress",progress:PROGRESS_CARDS+n.length-1})}}}c+="Rejected: "+f+" cards\n","cards"!==e.debug&&"all"!==e.debug||console.log(c);var F=void 0,V=!1;for(y of n)"Obelisk"===y.cardName&&(V=!0);if(V){var H=[];for(y of n){var I=y.cardType.split("/"),U=!1;for(M of I)"Action"===M&&(U=!0);U&&H.push(y)}if(H.length>0)F=H[Math.floor(Math.random()*H.length)];else for(var Y=0;Y<n.length;++Y)"Obelisk"===n[Y].cardName&&(n.splice(Y,1),Y=0)}var q=0;for(y of n)"Event"!==y.cardType&&"Landmark"!==y.cardType&&"Prosperity"===y.cardSet&&(q+=1);var K=!1,z=Math.random()*n.length;if(q>=z&&(K=!0),"all"===e.debug){var J=K?"Proserity cards in use":"Proserity cards not in use",Q=q+" cards",Z=z.toFixed(2)+" chance";console.log(J+" with "+Q+" and "+Z)}supplyCards=[],K&&(supplyCards.push("Platinum"),supplyCards.push("Colony")),result={result:"success",kingdomCards:n,supplyCards:supplyCards,baneCard:l,obeliskCard:F},postMessage(result)}function findTypeChances(e,a,r){var o=[];for(s of r){c1=s.c1,c2=s.c2;var n=0,p=0,l=0;for(c of e)for(t of c.types)c1===t&&(n+=1),c2===t&&(p+=1);for(c of a)for(t of c.types)c2===t&&(l+=1);var d=0,i=0;for(s2 of r)c1===s2.c1&&(d+=1),c2===s2.c2&&(i+=1);if(n>0&&l>0&&d>0){var h=.1*Math.pow(l,3),f=Math.pow(d,.6),g=Math.pow(i,.5),m=Math.pow(n,.3)/f/g*h/Math.pow(2,p),u=s.r+1,v={c1:c1,cardType:c2,chance:u*m};o.push(v)}}return o}self.addEventListener("message",function(e){postMessage({result:"progress",progress:0});var a=e.data;console.log(a.appDir),importScripts(a.appDir+"/app/scripts/marknote.js"),importScripts(a.appDir+"/app/scripts/card-selection/xml-to-card.js"),postMessage({result:"progress",progress:1});var t=new marknote.Parser,r=t.parseURL(a.appDir+"/app/data/synergies.xml",null,"GET");if(200===t.getXHRStatus()){var o=r.getRootElement().getChildElements("s"),s=[];for(sXml of o){var n={c1:sXml.getAttributeValue("c1"),c2:sXml.getAttributeValue("c2"),r:parseInt(sXml.getContentAt(0))};s.push(n)}var c=new marknote.Parser,p=c.parseURL(a.appDir+"/app/data/similarignore.xml",null,"GET");if(200===c.getXHRStatus()){var l=p.getRootElement().getChildElements("type"),d=[];for(siXml of l)d.push(siXml.getContentAt(0).toString());generateCards(a,s,d)}}else closeWithError("There was a problem parsing card synergies")});