const turboPi__version = "3.19.8";

// Глобальный флаг для внешнего MutationObserver’а
let notMutation = true;

console.log("TurboPI - extention by @sheva_r6")
// Массивы с идентификаторами
const groupA = [
    /*A-1*/ "LOT-PRESORT0_10001687230", /*A-2*/ "LOT-PRESORT0_10001687109", /*A-3*/ "LOT-PRESORT0_10001773532",
    /*A-4*/ "LOT-PRESORT0_10001687155", /*A-5*/ "LOT-PRESORT0_10026561017", /*A-6*/ "LOT-PRESORT0_10028639986",
    /*A-7*/ "LOT-PRESORT0_10031079269", /*A-8*/ "LOT-PRESORT0_10027183323", /*A-9*/ "LOT-PRESORT0_10033681929",
    /*A-10*/ "LOT-PRESORT0_10024809874", /*A-11*/ "LOT-PRESORT0_10025088072", /*A-12*/ "LOT-PRESORT0_10028564820",
    /*A-13*/ "LOT-PRESORT0_10001771708", /*A-14*/ "LOT-PRESORT0_10001771709", /*A-15*/ "LOT-PRESORT0_10001775401",
    /*A-16*/ "LOT-PRESORT0_10033472682", /*A-17*/ "LOT-PRESORT0_10001777872", /*A-18*/ "LOT-PRESORT0_10001779432",
    /*A-19*/ "LOT-PRESORT0_10001781121", /*A-20*/ "LOT-PRESORT0_10029180091", /*A-21*/ "LOT-PRESORT0_10001781702",
    /*A-22*/ "LOT-PRESORT0_10030178058", /*A-23*/ "LOT-PRESORT0_10019088501", /*A-24*/ "LOT-PRESORT0_10023658183",
    /*A-25*/ "LOT-PRESORT0_10007716466", /*A-26*/ "LOT-PRESORT0_10008588292", /*A-27*/ "LOT-PRESORT0_10008743088",
    /*A-28*/ "LOT-PRESORT0_10019971937", /*A-29*/ "LOT-PRESORT0_10009118649", /*A-30*/ "LOT-PRESORT0_10027169431",
    /*A-31*/ "LOT-PRESORT0_10009531618", /*A-32*/ "LOT-PRESORT0_10030723515", /*A-33*/ "LOT-PRESORT0_10026817425",
    /*A-34*/ "LOT-PRESORT0_10006517362", /*A-35*/ "LOT-PRESORT0_10019593216", /*A-36*/ "LOT-PRESORT0_10033335465",
    /*A-37*/ "LOT-PRESORT0_10012206738", /*A-38*/ "LOT-PRESORT0_10032816322", /*A-39*/ "LOT-PRESORT0_10020112514",
    /*A-40*/ "LOT-PRESORT0_10015196680", /*A-41*/ "LOT-PRESORT0_10029104324", /*A-42*/ "LOT-PRESORT0_10020227389",
    /*A-43*/ "LOT-PRESORT0_10015288146", /*A-44*/ "LOT-PRESORT0_10026834849", /*A-45*/ "LOT-PRESORT0_10016875594",
    /*A-46*/ "LOT-PRESORT0_10032594359", /*A-47*/ "LOT-PRESORT0_10025119141", /*A-48*/ "LOT-PRESORT0_10020925538",
    /*A-49*/ "LOT-PRESORT0_10019317740", /*A-50*/ "LOT-PRESORT0_10026265283", /*A-51*/ "LOT-PRESORT0_10032805295",
    /*A-52*/ "LOT-PRESORT0_10001774098", /*A-53*/ "LOT-PRESORT0_10032805269", /*A-54*/ "LOT-PRESORT0_10028536193",
    /*A-55*/ "LOT-PRESORT0_10017581334", /*A-56*/ "LOT-PRESORT0_10018687186", /*A-57*/ "LOT-PRESORT0_10032737571",
    /*A-58*/ "LOT-PRESORT0_10014397117", /*A-59*/ "LOT-PRESORT0_10011536615", /*A-60*/ "LOT-PRESORT0_10016294975",
    /*A-61*/ "LOT-PRESORT0_10017804262", /*A-62*/ "LOT-PRESORT0_10032733166", /*A-63*/ "LOT-PRESORT0_10022708547",
    /*A-64*/ "LOT-PRESORT0_10013726089", /*A-65*/ "LOT-PRESORT0_10001745421", /*A-66*/ "LOT-PRESORT0_10033590739",
    /*A-67*/ "LOT-PRESORT0_10033984659", /*A-68*/ "LOT-PRESORT0_10034237114", /*A-69*/ "LOT-PRESORT0_10034237098",
    /*A-70*/ "LOT-PRESORT0_10033984658", /*A-71*/ "LOT-PRESORT0_10033984661", /*A-72*/ "LOT-PRESORT0_10034024103"
];

const Aextra = [
    /*A-317*/ "LOT-PRESORT0_10033335465", /*A-318*/ "LOT-PRESORT0_10033472682", /*D-319*/ "LOT-PRESORT0_10009636250",
    /*A-320*/ "LOT-PRESORT0_10032737571", /*A-321*/ "LOT-PRESORT0_10001745421", /*D-322*/ "LOT-PRESORT0_10010837943",
    /*A-323*/ "LOT-PRESORT0_10013177800", /*A-324*/ "LOT-PRESORT0_10020699403"

];

const groupB = [
    /*B-73*/ "LOT-PRESORT0_10017668474", /*B-74*/ "LOT-PRESORT0_10032521918", /*B-75*/ "LOT-PRESORT0_10028915707",
    /*B-76*/ "LOT-PRESORT0_10034159303", /*B-77*/ "LOT-PRESORT0_10030968510", /*B-78*/ "LOT-PRESORT0_10017215509",
    /*B-79*/ "LOT-PRESORT0_10028310892", /*B-80*/ "LOT-PRESORT0_10017924934", /*B-81*/ "LOT-PRESORT0_10033633990",
    /*B-82*/ "LOT-PRESORT0_10022843623", /*B-83*/ "LOT-PRESORT0_10020061789", /*B-84*/ "LOT-PRESORT0_10019753260",
    /*B-85*/ "LOT-PRESORT0_10028976448", /*B-86*/ "LOT-PRESORT0_10032523817", /*B-87*/ "LOT-PRESORT0_10020148889",
    /*B-88*/ "LOT-PRESORT0_10015209859", /*B-89*/ "LOT-PRESORT0_10019284999", /*B-90*/ "LOT-PRESORT0_10034237125",
    /*B-91*/ "LOT-PRESORT0_10019216758", /*B-92*/ "LOT-PRESORT0_10033504569", /*B-93*/ "LOT-PRESORT0_10033814989",
    /*B-94*/ "LOT-PRESORT0_10032816565", /*B-95*/ "LOT-PRESORT0_10032805304", /*B-96*/ "LOT-PRESORT0_10025088075",
    /*B-97*/ "LOT-PRESORT0_10020781191", /*B-98*/ "LOT-PRESORT0_10005613183", /*B-99*/ "LOT-PRESORT0_10026542877",
    /*B-100*/ "LOT-PRESORT0_10025088077", /*B-101*/ "LOT-PRESORT0_10033610698", /*B-102*/ "LOT-PRESORT0_10021396698",
    /*B-103*/ "LOT-PRESORT0_10016301199", /*B-104*/ "LOT-PRESORT0_10019909311", /*B-105*/ "LOT-PRESORT0_10033998965",
    /*B-106*/ "LOT-PRESORT0_10019424504", /*B-107*/ "LOT-PRESORT0_10020113561", /*B-108*/ "LOT-PRESORT0_10033573293",
    /*B-109*/ "LOT-PRESORT0_10021495904", /*B-110*/ "LOT-PRESORT0_10020252622", /*B-111*/ "LOT-PRESORT0_10021014572",
    /*B-112*/ "LOT-PRESORT0_10019971935", /*B-113*/ "LOT-PRESORT0_10033809392", /*B-114*/ "LOT-PRESORT0_10019659525",
    /*B-115*/ "LOT-PRESORT0_10018235130", /*B-116*/ "LOT-PRESORT0_10019984897", /*B-117*/ "LOT-PRESORT0_10019284987",
    /*B-118*/ "LOT-PRESORT0_10017780723", /*B-119*/ "LOT-PRESORT0_10020714959", /*B-120*/ "LOT-PRESORT0_10031089465",
    /*B-121*/ "LOT-PRESORT0_10020010334", /*B-122*/ "LOT-PRESORT0_10019400674", /*B-123*/ "LOT-PRESORT0_10019779709",
    /*B-124*/ "LOT-PRESORT0_10028814498", /*B-125*/ "LOT-PRESORT0_10020216409", /*B-126*/ "LOT-PRESORT0_10023004761",
    /*B-127*/ "LOT-PRESORT0_10015998153", /*B-128*/ "LOT-PRESORT0_10011742355", /*B-129*/ "LOT-PRESORT0_10016975226",
    /*B-130*/ "LOT-PRESORT0_10020139837", /*B-131*/ "LOT-PRESORT0_10001698136", /*B-132*/ "LOT-PRESORT0_10026630300",
    /*B-133*/ "LOT-PRESORT0_10009501259", /*B-134*/ "LOT-PRESORT0_10020925836", /*B-135*/ "LOT-PRESORT0_10028605382",
    /*B-136*/ "LOT-PRESORT0_10028658212", /*B-137*/ "LOT-PRESORT0_10029180089", /*B-138*/ "LOT-PRESORT0_10009636250",
    /*B-139*/ "LOT-PRESORT0_10029165704", /*B-140*/ "LOT-PRESORT0_10029180090", /*B-141*/ "LOT-PRESORT0_10032805312",
    /*B-142*/ "LOT-PRESORT0_10033184189", /*B-143*/ "LOT-PRESORT0_10020699403", /*B-144*/ "LOT-PRESORT0_10033225653"
];

const Bextra = [
    /*A-325*/ "LOT-PRESORT0_10005390729", /*A-326*/ "LOT-PRESORT0_10028014756", /*D-327*/ "LOT-PRESORT0_10033633332",
    /*A-328*/ "LOT-PRESORT0_10015246139", /*A-329*/ "LOT-PRESORT0_10033681930", /*D-330*/ "LOT-PRESORT0_10028650213",
    /*A-331*/ "LOT-PRESORT0_10015946515", /*A-332*/ "LOT-PRESORT0_10015376419"

];
 
const groupC = [
    /*C-145*/ "LOT-PRESORT0_10030280649", /*C-146*/ "LOT-PRESORT0_10033334113", /*C-147*/ "LOT-PRESORT0_10031690258",
    /*C-148*/ "LOT-PRESORT0_10001778289", /*C-149*/ "LOT-PRESORT0_10009457395", /*C-150*/ "LOT-PRESORT0_10006786298", 
    /*C-151*/ "LOT-PRESORT0_10020112355", /*C-152*/ "LOT-PRESORT0_10034325961", /*C-153*/ "LOT-PRESORT0_10031376171", 
    /*C-154*/ "LOT-PRESORT0_10034237123", /*C-155*/ "LOT-PRESORT0_10018726753", /*C-156*/ "LOT-PRESORT0_10010469199",
    /*C-157*/ "LOT-PRESORT0_10001695247", /*C-158*/ "LOT-PRESORT0_10033984660", /*C-159*/ "LOT-PRESORT0_10011890646", 
    /*C-160*/ "LOT-PRESORT0_10012058065", /*C-161*/ "LOT-PRESORT0_10012902366", /*C-162*/ "LOT-PRESORT0_10034237120", 
    /*C-163*/ "LOT-PRESORT0_10013176341", /*C-164*/ "LOT-PRESORT0_10033875853", /*C-165*/ "LOT-PRESORT0_10032942984", 
    /*C-166*/ "LOT-PRESORT0_10034237112", /*C-167*/ "LOT-PRESORT0_10014197155", /*C-168*/ "LOT-PRESORT0_10029340673", 
    /*C-169*/ "LOT-PRESORT0_10034237100", /*C-170*/ "LOT-PRESORT0_10020846840", /*C-171*/ "LOT-PRESORT0_10019971945", 
    /*C-172*/ "LOT-PRESORT0_10015008256", /*C-173*/ "LOT-PRESORT0_10001743469", /*C-174*/ "LOT-PRESORT0_10019009494", 
    /*C-175*/ "LOT-PRESORT0_10015555496", /*C-176*/ "LOT-PRESORT0_10033837079", /*C-177*/ "LOT-PRESORT0_10004748561", 
    /*C-178*/ "LOT-PRESORT0_10025684110", /*C-179*/ "LOT-PRESORT0_10016822523", /*C-180*/ "LOT-PRESORT0_10028463670", 
    /*C-181*/ "LOT-PRESORT0_10029276370", /*C-182*/ "LOT-PRESORT0_10020776105", /*C-183*/ "LOT-PRESORT0_10019902773", 
    /*C-184*/ "LOT-PRESORT0_10019222339", /*C-185*/ "LOT-PRESORT0_10030877438", /*C-186*/ "LOT-PRESORT0_10031690337", 
    /*C-187*/ "LOT-PRESORT0_10014209132", /*C-188*/ "LOT-PRESORT0_10023011621", /*C-189*/ "LOT-PRESORT0_10016575703", 
    /*C-190*/ "LOT-PRESORT0_10013171444", /*C-191*/ "LOT-PRESORT0_10019348753", /*C-192*/ "LOT-PRESORT0_10029331689", 
    /*C-193*/ "LOT-PRESORT0_10015059454", /*C-194*/ "LOT-PRESORT0_10032845934", /*C-195*/ "LOT-PRESORT0_10034237122", 
    /*C-196*/ "LOT-PRESORT0_10001687229", /*C-197*/ "LOT-PRESORT0_10013773199", /*C-198*/ "LOT-PRESORT0_10031989710", 
    /*C-199*/ "LOT-PRESORT0_10031924668", /*C-200*/ "LOT-PRESORT0_10015608914", /*C-201*/ "LOT-PRESORT0_10019997431", 
    /*C-202*/ "LOT-PRESORT0_10016972160", /*C-203*/ "LOT-PRESORT0_10033809396", /*C-204*/ "LOT-PRESORT0_10034237103", 
    /*C-205*/ "LOT-PRESORT0_10015405431", /*C-206*/ "LOT-PRESORT0_10034242903", /*C-207*/ "LOT-PRESORT0_10034237093", 
    /*C-208*/ "LOT-PRESORT0_10034237107", /*C-209*/ "LOT-PRESORT0_10033927575", /*C-210*/ "LOT-PRESORT0_10034237097", 
    /*C-211*/ "LOT-PRESORT0_10034237102", /*C-212*/ "LOT-PRESORT0_10033927560", /*C-213*/ "LOT-PRESORT0_10034237108", 
    /*C-214*/ "LOT-PRESORT0_10034237121", /*C-215*/ "LOT-PRESORT0_10034237137", /*C-216*/ "LOT-PRESORT0_10008918643",
    /*C-217*/ "LOT-PRESORT0_10026625448", /*C-218*/ "LOT-PRESORT0_10032471875", /*C-219*/ "LOT-PRESORT0_10024926016",
    /*C-220*/ "LOT-PRESORT0_10012752706", /*C-221*/ "LOT-PRESORT0_10019760523", /*C-222*/ "LOT-PRESORT0_10019903093",
    /*C-223*/ "LOT-PRESORT0_10015941488", /*C-224*/ "LOT-PRESORT0_10021373090", /*C-225*/ "LOT-PRESORT0_10016888305",
    /*C-226*/ "LOT-PRESORT0_10032521941", /*C-227*/ "LOT-PRESORT0_10021106509", /*C-228*/ "LOT-PRESORT0_10023077840",
    /*C-229*/ "LOT-PRESORT0_10018694400", /*C-230*/ "LOT-PRESORT0_10021020233", /*C-231*/ "LOT-PRESORT0_10019921468",
    /*C-232*/ "LOT-PRESORT0_10034151521", /*C-233*/ "LOT-PRESORT0_10017236506", /*C-234*/ "LOT-PRESORT0_10018863874",
    /*C-235*/ "LOT-PRESORT0_10032074409", /*C-236*/ "LOT-PRESORT0_10031921539", /*C-237*/ "LOT-PRESORT0_10034237105",
    /*C-238*/ "LOT-PRESORT0_10032594345", /*C-239*/ "LOT-PRESORT0_10017706478", /*C-240*/ "LOT-PRESORT0_10029740966",
    /*C-241*/ "LOT-PRESORT0_10017448649", /*C-242*/ "LOT-PRESORT0_10019406530", /*C-243*/ "LOT-PRESORT0_10018995404",
    /*C-244*/ "LOT-PRESORT0_10003666185", /*C-245*/ "LOT-PRESORT0_10027344491", /*C-246*/ "LOT-PRESORT0_10032711464",
    /*C-247*/ "LOT-PRESORT0_10019598385", /*C-248*/ "LOT-PRESORT0_10022024617", /*C-249*/ "LOT-PRESORT0_10022664882"
];

const Cextra = [
    /*C-333*/ "LOT-PRESORT0_10033984660", /*C-334*/ "LOT-PRESORT0_10034237112", /*C-335*/ "LOT-PRESORT0_10034237123",
    /*C-336*/ "LOT-PRESORT0_10034237100"
];

const groupD = [
    /*D-253*/ "LOT-PRESORT0_10017663260", /*D-254*/ "LOT-PRESORT0_10020148870", /*D-255*/ "LOT-PRESORT0_10027277771",
    /*D-256*/ "LOT-PRESORT0_10023077839", /*D-257*/ "LOT-PRESORT0_10032525345", /*D-258*/ "LOT-PRESORT0_10023077836",
    /*D-259*/ "LOT-PRESORT0_10032617212", /*D-260*/ "LOT-PRESORT0_10025088074", /*D-261*/ "LOT-PRESORT0_10023698268",
    /*D-262*/ "LOT-PRESORT0_10001790520", /*D-263*/ "LOT-PRESORT0_10031671431", /*D-264*/ "LOT-PRESORT0_10025964042",
    /*D-265*/ "LOT-PRESORT0_10034237088", /*D-266*/ "LOT-PRESORT0_10027221446", /*D-267*/ "LOT-PRESORT0_10001755020",
    /*D-268*/ "LOT-PRESORT0_10001684570", /*D-269*/ "LOT-PRESORT0_10029933637", /*D-270*/ "LOT-PRESORT0_10026883007",
    /*D-271*/ "LOT-PRESORT0_10032583337", /*D-272*/ "LOT-PRESORT0_10029090425", /*D-273*/ "LOT-PRESORT0_10016002401",
    /*D-274*/ "LOT-PRESORT0_10029641748", /*D-275*/ "LOT-PRESORT0_10029910066", /*D-276*/ "LOT-PRESORT0_10030236569",
    /*D-277*/ "LOT-PRESORT0_10030219510", /*D-278*/ "LOT-PRESORT0_10031023319", /*D-279*/ "LOT-PRESORT0_10031547613",
    /*D-280*/ "LOT-PRESORT0_10030762695", /*D-281*/ "LOT-PRESORT0_10015703272", /*D-282*/ "LOT-PRESORT0_10004668968",
    /*D-283*/ "LOT-PRESORT0_10017964774", /*D-284*/ "LOT-PRESORT0_10029297248", /*D-285*/ "LOT-PRESORT0_10032584053",
    /*D-286*/ "LOT-PRESORT0_10021057200", /*D-287*/ "LOT-PRESORT0_10032419301", /*D-288*/ "LOT-PRESORT0_10031039901",
    /*D-289*/ "LOT-PRESORT0_10032539409", /*D-290*/ "LOT-PRESORT0_10033335497", /*D-291*/ "LOT-PRESORT0_10001684211",
    /*D-292*/ "LOT-PRESORT0_10032654980", /*D-293*/ "LOT-PRESORT0_10004305022", /*D-294*/ "LOT-PRESORT0_10031446384",
    /*D-295*/ "LOT-PRESORT0_10032593071", /*D-296*/ "LOT-PRESORT0_10031627799", /*D-297*/ "LOT-PRESORT0_10033472722",
    /*D-298*/ "LOT-PRESORT0_10032378517", /*D-299*/ "LOT-PRESORT0_10032150470", /*D-300*/ "LOT-PRESORT0_10033927577",
    /*D-301*/ "LOT-PRESORT0_10034237124", /*D-302*/ "LOT-PRESORT0_10034237092", /*D-303*/ "LOT-PRESORT0_10034325957",
    /*D-304*/ "LOT-PRESORT0_10034325956", /*D-305*/ "LOT-PRESORT0_10034325964", /*D-306*/ "LOT-PRESORT0_10034325953",
    /*D-307*/ "LOT-PRESORT0_10034325960", /*D-308*/ "LOT-PRESORT0_10034237115", /*D-309*/ "LOT-PRESORT0_10034237130",
    /*D-310*/ "LOT-PRESORT0_10034237126", /*D-311*/ "LOT-PRESORT0_10034237129", /*D-312*/ "LOT-PRESORT0_10034237087",
    /*D-313*/ "LOT-PRESORT0_10034237131", /*D-314*/ "LOT-PRESORT0_10034237127", /*D-315*/ "LOT-PRESORT0_10034237118",
    /*D-316*/ "LOT-PRESORT0_10018832178", /*D-317*/ "LOT-PRESORT0_10034325948", /*D-318*/ "LOT-PRESORT0_10034237101",
    /*D-319*/ "LOT-PRESORT0_10034325959", /*D-320*/ "LOT-PRESORT0_10005390729", /*D-321*/ "LOT-PRESORT0_10028014756",
    /*D-322*/ "LOT-PRESORT0_10033633332", /*D-323*/ "LOT-PRESORT0_10028650213", /*D-324*/ "LOT-PRESORT0_10033681930",
    /*D-325*/ "LOT-PRESORT0_10034325958", /*D-326*/ "LOT-PRESORT0_10034237117", /*D-327*/ "LOT-PRESORT0_10034237128",
    /*D-328*/ "LOT-PRESORT0_10034242912", /*D-329*/ "LOT-PRESORT0_10034237139", /*D-330*/ "LOT-PRESORT0_10034237133",
    /*D-331*/ "LOT-PRESORT0_10034237095", /*D-332*/ "LOT-PRESORT0_10034237091", /*D-333*/ "LOT-PRESORT0_10034237090",
    /*D-334*/ "LOT-PRESORT0_10034237132", /*D-335*/ "LOT-PRESORT0_10034237134", /*D-336*/ "LOT-PRESORT0_10034237096",
    /*D-337*/ "LOT-PRESORT0_10034237119", /*D-338*/ "LOT-PRESORT0_10034237094", /*D-339*/ "LOT-PRESORT0_10034237136",
    /*D-340*/ "LOT-PRESORT0_10034237116", /*D-341*/ "LOT-PRESORT0_10034237135", /*D-342*/ "LOT-PRESORT0_10034237109",
    /*D-343*/ "LOT-PRESORT0_10034237084", /*D-344*/ "LOT-PRESORT0_10034237086", /*D-345*/ "LOT-PRESORT0_10034237104",
    /*D-346*/ "LOT-PRESORT0_10034237099", /*D-347*/ "LOT-PRESORT0_10034237106", /*D-348*/ "LOT-PRESORT0_10034237083",
    /*D-349*/ "LOT-PRESORT0_10034237138", /*D-350*/ "LOT-PRESORT0_10034237113", /*D-351*/ "LOT-PRESORT0_10034237085"
];

const Dextra = [
    /*D-???*/ "LOT-PRESORT0_unset"
];

function updateSpanClasses() {
    const spans = document.querySelectorAll('span[data-e2e="sortable-table-grouping-directions"]');
    spans.forEach((span) => {
        const text = span.textContent.trim();
        let position;
        let label = "";

        // Проверка группы A
        if ((position = groupA.indexOf(text)) !== -1) {
            label = `A-${position + 1}`;
            if (span.classList.contains('diman__zoneOverflow')) {
                span.classList.remove('diman__zoneOverflow');
            }
        } 
        // Проверка группы B
        else if ((position = groupB.indexOf(text)) !== -1) {
            label = `B-${position + 1 + 72}`;
            if (span.classList.contains('diman__zoneOverflow')) {
                span.classList.remove('diman__zoneOverflow');
            }
        } 
        // Проверка группы C
        else if ((position = groupC.indexOf(text)) !== -1) {
            label = `C-${position + 1 + 144}`;
            if (span.classList.contains('diman__zoneOverflow')) {
                span.classList.remove('diman__zoneOverflow');
            }
        } 
        // Проверка группы D
        else if ((position = groupD.indexOf(text)) !== -1) {
            label = `D-${position + 253}`;
            if (span.classList.contains('diman__zoneOverflow')) {
                span.classList.remove('diman__zoneOverflow');
            }
        } 

        // //D- Проверка группы больше допустимых в зоне D
        // else if ((position = Dextra.indexOf(text)) !== -1) {
        //     if (span.classList.contains('diman__zoneOverflow-D')) {
        //         span.classList.remove('diman__zoneOverflow-D');
        //     }
        //     label = `D-${position + 1 + 288}`;
        //     const positionCounter = position + 1 + 288
        //     if(positionCounter >= 289){
        //     span.classList.add('diman__zoneOverflow-D')
        //     }
        // }
        // //A- Проверка группы больше допустимых в зоне A
        // else if ((position = Aextra.indexOf(text)) !== -1) {
        //     if (span.classList.contains('diman__zoneOverflow-A')) {
        //         span.classList.remove('diman__zoneOverflow-A');
        //     }
        //     label = `A-${position + 1 + 316}`;
        //     const positionCounter = position + 1 + 316
        //     if(positionCounter >= 317){
        //     span.classList.add('diman__zoneOverflow-A')
        //     }
        // }
        // //B- Проверка группы больше допустимых в зоне B
        // else if ((position = Bextra.indexOf(text)) !== -1) {
        //     if (span.classList.contains('diman__zoneOverflow-B')) {
        //         span.classList.remove('diman__zoneOverflow-B');
        //     }
        //     label = `B-${position + 1 + 323}`;
        //     const positionCounter = position + 1 + 323
        //     if(positionCounter >= 324){
        //     span.classList.add('diman__zoneOverflow-B')
        //     }
        // }
        // //C- Проверка группы больше допустимых в зоне B
        // else if ((position = Cextra.indexOf(text)) !== -1) {
        //     if (span.classList.contains('diman__zoneOverflow-C')) {
        //         span.classList.remove('diman__zoneOverflow-C');
        //     }
        //     label = `C-${position + 1 + 332}`;
        //     const positionCounter = position + 1 + 332
        //     if(positionCounter >= 333){
        //     span.classList.add('diman__zoneOverflow-C')
        //     }
        // }

        // Если нашли совпадение, добавляем класс и атрибут
        if (label) {
            span.classList.add('diman__groupBuffer');
            span.setAttribute('data-label', label);

            
            span.addEventListener('click', ()=>{
                let bufferText = span.textContent
                navigator.clipboard.writeText(bufferText)
                span.classList.add('bufferTextCopyed')
                setTimeout(() => {
                    span.classList.remove('bufferTextCopyed')
                }, 300);
            })
        } 
        // Если не нашли совпадение, удаляем класс и атрибут
        else {
            span.classList.remove('diman__groupBuffer');
            span.removeAttribute('data-label');
        }
    });
}

function updateSpanClassesInSortable() {
    const divs = document.querySelectorAll('div[data-tid="66fcbac9 cb97fdce d276ac8a ee6163ae"]');
    divs.forEach((div) => {
        const text = div.textContent.trim();
        let position;
        let label = "";
        let rawLabel;
        let groupName;

        // Проверка группы A
        if ((position = groupA.indexOf(text)) !== -1) {
            label = `A-${position + 1}`;
            if (div.classList.contains('diman__zoneOverflow')) {
                div.classList.remove('diman__zoneOverflow');
            }
            rawLabel = position + 1
            groupName = "A"
        } 
        // Проверка группы B
        else if ((position = groupB.indexOf(text)) !== -1) {
            label = `B-${position + 1 + 72}`;
            if (div.classList.contains('diman__zoneOverflow')) {
                div.classList.remove('diman__zoneOverflow');
            }
            rawLabel = position + 1 + 72
            groupName = "B"
        } 
        // Проверка группы C
        else if ((position = groupC.indexOf(text)) !== -1) {
            label = `C-${position + 1 + 144}`;
            if (div.classList.contains('diman__zoneOverflow')) {
                div.classList.remove('diman__zoneOverflow');
            }
            rawLabel = position + 1 + 144
            groupName = "C"
        } 
        // Проверка группы D
        else if ((position = groupD.indexOf(text)) !== -1) {
            label = `D-${position + 253}`;
            if (div.classList.contains('diman__zoneOverflow')) {
                div.classList.remove('diman__zoneOverflow');
            }
            rawLabel = position + 253
            groupName = "D"
        } 
        // //D- Проверка группы больше допустимых в зоне D
        // else if ((position = Dextra.indexOf(text)) !== -1) {
        //     label = `D-${position + 1 + 288}`;
        //     if (div.classList.contains('diman__zoneOverflow-D')) {
        //         div.classList.remove('diman__zoneOverflow-D');
        //     }
        //     rawLabel = position + 1 + 288
        //     groupName = "zoneOferflow"
        //     div.classList.add('diman__zoneOverflow-D')
        // }
        // //A- Проверка группы больше допустимых в зоне A
        // else if ((position = Aextra.indexOf(text)) !== -1) {
        //     label = `A-${position + 1 + 316}`;
        //     if (div.classList.contains('diman__zoneOverflow-A')) {
        //         div.classList.remove('diman__zoneOverflow-A');
        //     }
        //     rawLabel = position + 1 + 316
        //     groupName = "zoneOferflow"
        //     div.classList.add('diman__zoneOverflow-A')
        // }
        // //B- Проверка группы больше допустимых в зоне B
        // else if ((position = Bextra.indexOf(text)) !== -1) {
        //     label = `B-${position + 1 + 323}`;
        //     if (div.classList.contains('diman__zoneOverflow-B')) {
        //         div.classList.remove('diman__zoneOverflow-B');
        //     }
        //     rawLabel = position + 1 + 323
        //     groupName = "zoneOferflow"
        //     div.classList.add('diman__zoneOverflow-B')
        // }
        // //C- Проверка группы больше допустимых в зоне B
        // else if ((position = Cextra.indexOf(text)) !== -1) {
        //     label = `C-${position + 1 + 332}`;
        //     if (div.classList.contains('diman__zoneOverflow-C')) {
        //         div.classList.remove('diman__zoneOverflow-C');
        //     }
        //     rawLabel = position + 1 + 332
        //     groupName = "zoneOferflow"
        //     div.classList.add('diman__zoneOverflow-C')
        // }

        // Если нашли совпадение, добавляем класс и атрибут
        if (label) {
            div.classList.add('diman__groupBufferSortables');
            div.setAttribute('data-label', label);

            function addBatchMap() {
                const finForMe_diman__InfoPretier = document.querySelector('.diman__InfoPretier');
                if (finForMe_diman__InfoPretier) {

                    if (!finForMe_diman__InfoPretier.querySelector('.batchMapContainer')) {
                        let batchMapContainer = document.createElement("div");
                        batchMapContainer.classList.add("batchMapContainer");
                        finForMe_diman__InfoPretier.appendChild(batchMapContainer);
                        
                        if(groupName == "A"){
                            batchMapContainer.innerHTML =`
                        <div class="proection3DContainer-info">
                            <p>Карта батчей для зоны – ${groupName}</p>
                        </div>
                        <div class="diman__batch">
                            <div class="diman__batchPreivewContainer" container-type="defaultsection">
                                <div class="diman__batchPreivewSection">
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="64">64</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="68">68</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="72">72</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="63">63</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="67">67</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="71">71</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="62">62</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="66">66</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="70">70</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="61">61</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="65">65</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="69">69</div>
                                    </div>
                                </div>
                                <div class="diman__batchBlock">
                                    <div class="diman__batchTitle">A</div>
                                </div>
                                <div class="diman__batchPreivewSection">
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="9">9</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="5">5</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="1">1</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="10">10</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="6">6</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="2">2</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="11">11</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="7">7</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="3">3</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="12">12</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="8">8</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="4">4</div>
                                    </div>
                                </div>
                            </div>
                            <div class="diman__batchPreivewContainer" container-type="defaultsection" style="margin-top: 4px;" >
                                <div class="diman__batchPreivewSection">
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="52">52</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="56">56</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="60">60</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="51">51</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="55">55</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="59">59</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="50">50</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="54">54</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="58">58</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="49">49</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="53">53</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="57">57</div>
                                    </div>
                                </div>
                                <div class="diman__batchBlock"></div>
                                <div class="diman__batchPreivewSection">
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="21">21</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="17">17</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="13">13</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="22">22</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="18">18</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="14">14</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="23">23</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="19">19</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="15">15</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="24">24</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="20">20</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="16">16</div>
                                    </div>
                                </div>
                            </div>
                            <div class="diman__batchPreivewContainer" container-type="uppersection">
                                <div class="diman__batchBlock"></div>
                                <div class="diman__batchPreivewSection" style="margin-right: 4px;">
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="48">48</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="47">47</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="46">46</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="45">45</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="44">44</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="43">43</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="42">42</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="41">41</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="40">40</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="39">39</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="38">38</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="37">37</div>
                                    </div>
                                </div>
                                <div class="diman__batchPreivewSection">
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="36">36</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="35">35</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="34">34</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="33">33</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="32">32</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="31">31</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="30">30</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="29">29</div>
                                    </div>
                                    <div class="diman__batchPreivewSectionRow">
                                        <div class="diman__batchPreivewSectionCell" dimanCell="28">28</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="27">27</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="26">26</div>
                                        <div class="diman__batchPreivewSectionCell" dimanCell="25">25</div>
                                    </div>
                                </div>
                                <div class="diman__batchBlock"></div>
                            </div>
                        </div>
                            `
                        }else if(groupName == "B"){
                            batchMapContainer.innerHTML =`
                                <div class="proection3DContainer-info">
                                    <p>Карта батчей для зоны – ${groupName}</p>
                                </div>
                                <div class="diman__batch">
                                    <div class="diman__batchPreivewContainer" container-type="uppersection">
                                        <div class="diman__batchBlock"></div>
                                        <div class="diman__batchPreivewSection" style="margin-right: 4px;">
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="97">97</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="98">98</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="99">99</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="100">100</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="101">101</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="102">102</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="103">103</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="104">104</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="105">105</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="106">106</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="107">107</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="108">108</div>
                                            </div>
                                        </div>
                                        <div class="diman__batchPreivewSection">
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="109">109</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="110">110</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="111">111</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="112">112</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="113">113</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="114">114</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="115">115</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="116">116</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="117">117</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="118">118</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="119">119</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="120">120</div>
                                            </div>
                                        </div>
                                        <div class="diman__batchBlock"></div>
                                    </div>
                                    <div class="diman__batchPreivewContainer" container-type="defaultsection">
                                        <div class="diman__batchPreivewSection">
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="88">88</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="92">92</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="96">96</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="87">87</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="91">91</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="95">95</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="86">86</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="90">90</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="94">94</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="85">85</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="89">89</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="93">93</div>
                                            </div>
                                        </div>
                                        <div class="diman__batchBlock">
                                            <div class="diman__batchTitle">B</div>
                                        </div>
                                        <div class="diman__batchPreivewSection">
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="129">129</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="125">125</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="121">121</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="130">130</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="126">126</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="122">122</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="131">131</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="127">127</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="123">123</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="132">132</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="128">128</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="124">124</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="diman__batchPreivewContainer" container-type="defaultsection" style="margin-top: 4px;" >
                                        <div class="diman__batchPreivewSection">
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="76">76</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="80">80</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="84">84</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="75">75</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="79">79</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="83">83</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="74">74</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="78">78</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="82">82</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="73">73</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="77">77</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="81">81</div>
                                            </div>
                                        </div>
                                        <div class="diman__batchBlock"></div>
                                        <div class="diman__batchPreivewSection">
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="141">141</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="137">137</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="133">133</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="142">142</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="138">138</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="134">134</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="143">143</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="139">139</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="135">135</div>
                                            </div>
                                            <div class="diman__batchPreivewSectionRow">
                                                <div class="diman__batchPreivewSectionCell" dimanCell="144">144</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="140">140</div>
                                                <div class="diman__batchPreivewSectionCell" dimanCell="136">136</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `
                        }else if(groupName == "C"){
                            batchMapContainer.innerHTML =`
                            
                            <div class="proection3DContainer-info">
                                <p>Карта батчей для зоны – ${groupName}</p>
                            </div>
                            <div class="diman__batch">
                                <div class="diman__batchPreivewContainer" container-type="uppersection">
                                    <div class="diman__batchBlock"></div>
                                    <div class="diman__batchPreivewSection" style="margin-right: 4px;">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="193">193</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="194">194</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="195">195</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="196">196</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="197">197</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="198">198</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="199">199</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="200">200</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="201">201</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="202">202</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="203">203</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="204">204</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchPreivewSection" style="margin-right: 4px;">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="205">205</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="206">206</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="207">207</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="208">208</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="209">209</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="210">210</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="211">211</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="212">212</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="213">213</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="214">214</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="215">215</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="216">216</div>
                                        </div>
                                    </div><div class="diman__batchPreivewSection">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="217">217</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="218">218</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="219">219</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="220">220</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="221">221</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="222">222</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="223">223</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="224">224</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="225">225</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="226">226</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="227">227</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="228">228</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchBlock"></div>
                                </div>
                                <div class="diman__batchPreivewContainer" container-type="defaultsection">
                                    <div class="diman__batchPreivewSection">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="184">184</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="188">188</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="192">192</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="183">183</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="187">187</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="191">191</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="182">182</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="186">186</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="190">190</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="181">181</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="185">185</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="189">189</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchBlock" style="width: 330px;">
                                        <div class="diman__batchTitle">C</div>
                                    </div>
                                    <div class="diman__batchPreivewSection">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="237">237</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="233">233</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="229">229</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="238">238</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="234">234</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="230">230</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="239">239</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="234">234</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="231">231</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="240">240</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="236">236</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="232">232</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="diman__batchPreivewContainer" container-type="defaultsection" style="margin-top: 4px;">
                                    <div class="diman__batchPreivewSection">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="172">172</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="176">176</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="180">180</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="171">171</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="175">175</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="179">179</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="170">170</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="174">174</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="178">178</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="169">169</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="173">173</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="177">177</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchBlock" style="width: 330px;"></div>
                                    <div class="diman__batchPreivewSection">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="249">249</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="245">245</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="241">241</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="250">250</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="246">246</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="242">242</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="251">251</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="247">247</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="243">243</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="252">252</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="248">248</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="244">244</div>
                                        </div>
                                    </div>
                                </div>
                            <div class="diman__batchPreivewContainer" container-type="uppersection">
                                    <div class="diman__batchBlock"></div>
                                    <div class="diman__batchPreivewSection" style="margin-right: 4px;">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="168">168</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="167">167</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="166">166</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="165">165</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="164">164</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="163">163</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="162">162</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="161">161</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="160">160</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="159">159</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="158">158</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="157">157</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchPreivewSection" style="margin-right: 4px;">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="156">156</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="155">155</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="154">154</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="153">153</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="152">152</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="151">151</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="150">150</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="149">149</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="148">148</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="147">147</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="146">146</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="145">145</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchBlock" style="width: 190px;"></div>
                                </div></div>
                            `
                        }else if(groupName == "D"){
                            batchMapContainer.innerHTML =`
                            <div class="proection3DContainer-info">
                                <p>Карта батчей для зоны – ${groupName}</p>
                            </div>
                            <div class="diman__batch" style="">
                                <div class="diman__batchPreivewContainer" container-type="uppersection">
                                    <div class="diman__batchBlock"></div>
                                    <div class="diman__batchPreivewSection" style="margin-right: 4px;">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="337">337</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="338">338</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="339">339</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="340">340</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="341">341</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="342">342</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="343">343</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="344">344</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="345">345</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="346">346</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="347">347</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="348">348</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchPreivewSection" style="margin-right: 4px;">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="349">349</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="350">350</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="351">351</div>
                                            <div class="diman__batchPreivewSectionCell" emptyCell="true" dimancell="352">352</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" emptyCell="true" dimancell="353">353</div>
                                            <div class="diman__batchPreivewSectionCell" emptyCell="true" dimancell="354">354</div>
                                            <div class="diman__batchPreivewSectionCell" emptyCell="true" dimancell="355">355</div>
                                            <div class="diman__batchPreivewSectionCell" emptyCell="true" dimancell="356">356</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" emptyCell="true" dimancell="357">357</div>
                                            <div class="diman__batchPreivewSectionCell" emptyCell="true" dimancell="358">358</div>
                                            <div class="diman__batchPreivewSectionCell" emptyCell="true" dimancell="359">359</div>
                                            <div class="diman__batchPreivewSectionCell" emptyCell="true" dimancell="360">360</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchBlock" style="width: 190px;"></div>
                                </div>
                                <div class="diman__batchPreivewContainer" container-type="defaultsection">
                                    <div class="diman__batchPreivewSection">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="328">328</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="332">332</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="336">336</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="327">327</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="331">331</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="335">335</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="326">326</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="330">330</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="334">334</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="325">325</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="329">329</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="333">333</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchBlock" style="width: 330px;">
                                        <div class="diman__batchTitle">D</div>
                                    </div>
                                    <div class="diman__batchPreivewSection">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="261">261</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="257">257</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="253">253</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="262">262</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="258">258</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="254">254</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="263">263</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="259">259</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="255">255</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="264">264</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="260">260</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="256">256</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="diman__batchPreivewContainer" container-type="defaultsection" style="margin-top: 4px;">
                                    <div class="diman__batchPreivewSection">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="316">316</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="320">320</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="324">324</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="315">315</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="319">319</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="323">323</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="314">314</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="318">318</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="322">322</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="313">313</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="317">317</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="321">321</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchBlock" style="width: 330px;"></div>
                                    <div class="diman__batchPreivewSection">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="273">273</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="269">269</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="265">265</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="274">274</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="270">270</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="266">266</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="275">275</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="271">271</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="267">267</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="276">276</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="272">272</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="268">268</div>
                                        </div>
                                    </div>
                                </div>
                            <div class="diman__batchPreivewContainer" container-type="uppersection">
                                    <div class="diman__batchBlock"></div>
                                    <div class="diman__batchPreivewSection" style="margin-right: 4px;">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="312">312</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="311">311</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="310">310</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="309">309</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="308">308</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="307">307</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="306">306</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="305">305</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="304">304</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="303">303</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="302">302</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="301">301</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchPreivewSection" style="margin-right: 4px;">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="300">300</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="299">299</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="298">298</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="297">297</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="296">296</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="295">295</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="294">294</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="293">293</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="292">292</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="291">291</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="290">290</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="289">289</div>
                                        </div>
                                    </div><div class="diman__batchPreivewSection">
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="288">288</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="287">287</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="286">286</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="285">285</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="284">284</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="283">283</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="282">282</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="281">281</div>
                                        </div>
                                        <div class="diman__batchPreivewSectionRow">
                                            <div class="diman__batchPreivewSectionCell" dimancell="280">280</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="279">279</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="278">278</div>
                                            <div class="diman__batchPreivewSectionCell" dimancell="277">277</div>
                                        </div>
                                    </div>
                                    <div class="diman__batchBlock"></div>
                                </div>
                            </div>
                            `
                        }else if(groupName == "zoneOferflow"){
                            batchMapContainer.innerHTML =`
                                <div class="proection3DContainer-info">
                        <p>Карта батчей для зоны – ???</p>
                        </div>
                        <div class="diman__batch">
                            <div class="diman__batch-zoneOverflow">Неизвестная зона 😐</div>
                        </div>
                            `
                        }else{
                            return
                        }

                        const dimanCells = document.querySelectorAll('.diman__batchPreivewSectionCell');
                        
                        function isItEqual(){
                            if (dimanCells.length > 0) {
                                for (let i = 0; i < dimanCells.length; i++) {
                                    const cell = dimanCells[i];

                                    if (cell.hasAttribute('dimanCell')) {

                                        if (cell.getAttribute('dimanCell') === String(rawLabel)) {

                                            if (!cell.hasAttribute('diman-cell-active')) {
                                                cell.setAttribute('diman-cell-active', 'true');
                                                return
                                            }
                                        }
                                    }
                                }
                            }else{
                                isItEqual()
                            }
                        }
                        isItEqual()
                        
                    } else {
                        return;
                    }
                } else {

                    const maxRetries = 10;
                    let retries = 0;
            
                    const intervalId = setInterval(() => {
                        const element = document.querySelector('.diman__InfoPretier');
                        if (element) {
                            clearInterval(intervalId);
                            addBatchMap();
                        } else if (++retries >= maxRetries) {
                            clearInterval(intervalId);
                        }
                    }, 500);
                }
            }
            addBatchMap();

        } 

        else {
            div.classList.remove('diman__groupBufferSortables');
            div.removeAttribute('data-label');
        }
    });

}

function updateSpanClassesInCells() {
    const divs = document.querySelectorAll('span[data-e2e="grouping-direction"]');
    divs.forEach((div) => {
        const text = div.textContent.trim();
        let position;
        let label = "";

        // Проверка группы A
        if ((position = groupA.indexOf(text)) !== -1) {
            if (div.classList.contains('diman__zoneOverflow')) {
                div.classList.remove('diman__zoneOverflow');
            }
            label = `A-${position + 1}`;
        } 
        // Проверка группы B
        else if ((position = groupB.indexOf(text)) !== -1) {
            if (div.classList.contains('diman__zoneOverflow')) {
                div.classList.remove('diman__zoneOverflow');
            }
            label = `B-${position + 1 + 72}`;
        } 
        // Проверка группы C
        else if ((position = groupC.indexOf(text)) !== -1) {
            if (div.classList.contains('diman__zoneOverflow')) {
                div.classList.remove('diman__zoneOverflow');
            }
            label = `C-${position + 1 + 144}`;
        } 
        // Проверка группы D
        else if ((position = groupD.indexOf(text)) !== -1) {
            if (div.classList.contains('diman__zoneOverflow')) {
                div.classList.remove('diman__zoneOverflow');
            }
            label = `D-${position + 253}`;
        } 
        // //D- Проверка группы больше допустимых в зоне D
        // else if ((position = Dextra.indexOf(text)) !== -1) {
        //     if (div.classList.contains('diman__zoneOverflow-D')) {
        //         div.classList.remove('diman__zoneOverflow-D');
        //     }
        //     label = `D-${position + 1 + 288}`;
        //     div.classList.add('diman__zoneOverflow-D')
        // }
        // //A- Проверка группы больше допустимых в зоне A
        // else if ((position = Aextra.indexOf(text)) !== -1) {
        //     if (div.classList.contains('diman__zoneOverflow-A')) {
        //         div.classList.remove('diman__zoneOverflow-A');
        //     }
        //     label = `A-${position + 1 + 316}`;
        //     div.classList.add('diman__zoneOverflow-A')
        // }
        // //B- Проверка группы больше допустимых в зоне B
        // else if ((position = Bextra.indexOf(text)) !== -1) {
        //     if (div.classList.contains('diman__zoneOverflow-B')) {
        //         div.classList.remove('diman__zoneOverflow-B');
        //     }
        //     label = `B-${position + 1 + 324}`;
        //     div.classList.add('diman__zoneOverflow-B')
        // }
        // //C- Проверка группы больше допустимых в зоне C
        // else if ((position = Cextra.indexOf(text)) !== -1) {
        //     if (div.classList.contains('diman__zoneOverflow-C')) {
        //         div.classList.remove('diman__zoneOverflow-C');
        //     }
        //     label = `B-${position + 1 + 333}`;
        //     div.classList.add('diman__zoneOverflow-C')
        // }

        // Если нашли совпадение, добавляем класс и атрибут
        if (label) {
            div.classList.add('diman__groupBuffer');
            div.setAttribute('data-label', label);

            div.addEventListener('click', ()=>{
                let bufferText = div.textContent
                navigator.clipboard.writeText(bufferText)
                div.classList.add('bufferTextCopyed')
                setTimeout(() => {
                    div.classList.remove('bufferTextCopyed')
                }, 300);
            })
        } 
        // Если не нашли совпадение, удаляем класс и атрибут
        else {
            div.classList.remove('diman__groupBuffer');
            div.removeAttribute('data-label');
        }
    });
}

//!!! 

// Функция для обновления времени в нужных тегах <time>
function updateTimeElements() {
    document.querySelectorAll('time[data-tid="28adfd3 11655531"]').forEach(function(timeElement) {
        const datetime = timeElement.getAttribute('datetime');
        const date = new Date(datetime);
        const formattedTime = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        timeElement.textContent = formattedTime;
    });
}

// Функция для проверки строк <tr> и добавления класса при необходимости
function checkAndApplyClassToRows() {
    document.querySelectorAll('tbody tr').forEach(function(row) {
        // Ищем кнопку внутри текущего <tr>
        const button = row.querySelector('button[data-tid="8e34e3c2 d47a3f9b 2cf94f05 cd6e0115"]');
        if (button) {
            // Если кнопка найдена и текст совпадает, добавляем класс
            row.classList.add('diman__sortablesHideExtra');
        } else {
            // Удаляем класс, если условие не выполняется
            row.classList.remove('diman__sortablesHideExtra');
        }
    });
}

//% Icons                                                                                                                                                                                                                       
function setIconsToSortableStatus() {
    const sortableStatus = document.querySelectorAll('span[data-e2e="sortable-table-stage-display-name"] span');
    const getAllRobots = document.querySelectorAll('td button[data-tid="8e34e3c2 d47a3f9b 2cf94f05 cd6e0115"].___Clickable___fcJVD.__disabled___AE_CQ');
    
    getAllRobots.forEach(item =>{
        item.classList.add('diman__robot')
    })

    sortableStatus.forEach(item => {
        item.classList.add('diman__lineHeightFix')
        // Проверяем, есть ли атрибут с нужным значением
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-LABEL_CREATED_DIRECT' ? item.classList.add('diman__emptyLotCreated') : item.classList.remove('diman__emptyLotCreated')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-LABEL_CREATED_KEEPED_WITH_GROUP_DIRECT' ? item.classList.add('diman__emptyLotCreatedGroup') : item.classList.remove('diman__emptyLotCreatedGroup')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-LABEL_CREATED_WITH_COURIER_RETURN' ? item.classList.add('diman__emptyLotCreatedReturn') : item.classList.remove('diman__emptyLotCreatedReturn')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-LABEL_CREATED_WITH_COURIER_DIRECT' ? item.classList.add('diman__emptyLotCreated_sub-2') : item.classList.remove('diman__emptyLotCreated_sub-2')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-SORTING_IN_LOT_KEEPED_DIRECT' ? item.classList.add('diman__lotFillingInHran') : item.classList.remove('diman__lotFillingInHran')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-SORTING_IN_LOT_RETURN' ? item.classList.add('diman__lotReturn') : item.classList.remove('diman__lotReturn')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-SORTING_IN_LOT_KEEPED_RETURN' ? item.classList.add('diman__lotFillingInHranReturn') : item.classList.remove('diman__lotFillingInHranReturn')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-PACKED_KEEPED_DIRECT' ? item.classList.add('diman__lotPackedKeepedDirect') : item.classList.remove('diman__lotPackedKeepedDirect')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-SORTED_DIRECT' ? item.classList.add('diman__sortedDirect') : item.classList.remove('diman__sortedDirect')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-SORTED_RETURN' ? item.classList.add('diman__sortedReturn') : item.classList.remove('diman__sortedReturn')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-AWAITING_SORT_DIRECT' ? item.classList.add('diman__awaitingSort') : item.classList.remove('diman__awaitingSort')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-PREPARED_DIRECT' ? item.classList.add('diman__preparedDirect') : item.classList.remove('diman__preparedDirect')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-AWAITING_ACCEPTANCE_BY_COURIER_DIRECT' ? item.classList.add('diman__waitingCouriedAccept') : item.classList.remove('diman__waitingCouriedAccept')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-SHIPPED_DIRECT' ? item.classList.add('diman__shipped') : item.classList.remove('diman__shipped')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-SHIPPED_RETURN' ? item.classList.add('diman__shippedReturn') : item.classList.remove('diman__shippedReturn')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-FIRST_ACCEPT_DIRECT' ? item.classList.add('diman__firstAccept') : item.classList.remove('diman__firstAccept')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-FIRST_ACCEPT_RETURN' ? item.classList.add('diman__firstAcceptReturn') : item.classList.remove('diman__firstAcceptReturn')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-FINAL_ACCEPT_DIRECT' ? item.classList.add('diman__secondAccept') : item.classList.remove('diman__secondAccept')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-FINAL_ACCEPT_RETURN' ? item.classList.add('diman__secondAcceptReturn') : item.classList.remove('diman__secondAcceptReturn')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-AWAITING_DIRECT' ? item.classList.add('diman__waitingForAccept') : item.classList.remove('diman__waitingForAccept')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-AWAITING_RETURN' ? item.classList.add('diman__waitingForAcceptReturn') : item.classList.remove('diman__waitingForAcceptReturn')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-PRE_SORTED_DIRECT' ? item.classList.add('diman__predsortAccept') : item.classList.remove('diman__predsortAccept')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-PRE_SORTED_RETURN' ? item.classList.add('diman__predsortAcceptReturn') : item.classList.remove('diman__predsortAcceptReturn')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-KEEPED_DIRECT' ? item.classList.add('diman__onHran') : item.classList.remove('diman__onHran')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-KEEPED_RETURN' ? item.classList.add('diman__onHranReturn') : item.classList.remove('diman__onHranReturn')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-SORTING_IN_LOT_DIRECT' ? item.classList.add('diman__fliingHran') : item.classList.remove('diman__fliingHran')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-DELETED' ? item.classList.add('diman__deleted') : item.classList.remove('diman__deleted')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-CANCELLED' ? item.classList.add('diman__canceled') : item.classList.remove('diman__canceled')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-ARRIVED_DIRECT' ? item.classList.add('diman__arrived') : item.classList.remove('diman__arrived')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-TRANSIT_READY_LOT_DIRECT' ? item.classList.add('diman__transitLotReady') : item.classList.remove('diman__transitLotReady')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-SHIPPED_DIRECT_REPLACED' ? item.classList.add('diman__shippedReplaced') : item.classList.remove('diman__shippedReplaced')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-NOT_ACCEPTED_BY_COURIER_DIRECT' ? item.classList.add('diman__notAcceptedCourier') : item.classList.remove('diman__notAcceptedCourier')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-LOT_READY_FOR_FILLING_DIRECT' ? item.classList.add('diman__lotReadyForFillingDirect') : item.classList.remove('diman__lotReadyForFillingDirect')
        item.getAttribute('data-e2e-i18n-key') === 'common.sorting-center:stage-CONSOLIDATED' ? item.classList.add('diman__consolidated') : item.classList.remove('diman__consolidated')
    });
}

function highlightLinks() {
    const links = document.querySelectorAll('a[data-tid="8e34e3c2 d47a3f9b 2cf94f05 422bcbe4"]');
    
    links.forEach(link => {
        if (!link.querySelector('.diman_lotHighlightLastNumbers')) {
            const linkText = link.textContent || link.innerText;

            if (linkText && linkText.startsWith("F1254") && linkText.length >= 5 || linkText && linkText.startsWith("F3000") && linkText.length >= 5 ) {
                const lastFiveChars = linkText.slice(-5);
                const newText = linkText.slice(0, -5);

                link.textContent = newText;

                const span = document.createElement('span');
                span.classList.add('diman_lotHighlightLastNumbers');
                span.textContent = lastFiveChars;

                link.appendChild(span);
            }

            link.classList.add('diman_lotInSortables');
        }
    });
}


function addCopyButton() {
    const downloadLinks = document.querySelectorAll('td > div > div > div > a[icon="fileDownload"]');
    
    downloadLinks.forEach(link => {
        const parentDiv = link.closest('div');
        
        if (parentDiv) {
            const previousSibling = parentDiv.previousElementSibling;
            if (previousSibling && previousSibling.classList.contains('diman__copyFullOrderData')) {
                return;
            }
            
            const button = document.createElement('button');
            const buttonDefaultName = document.createElement('button');
            button.className = 'diman__copyFullOrderData';
            buttonDefaultName.className = 'diman__copyFullOrderDataDefault';
            
            const svg = `
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 80%;">
                        <path d="M17.0943 7.14643C17.6874 6.93123 17.9818 6.85378 18.1449 6.82608C18.1461 6.87823 18.1449 6.92051 18.1422 6.94825C17.9096 9.39217 16.8906 15.4048 16.3672 18.2026C16.2447 18.8578 16.1507 19.1697 15.5179 18.798C15.1014 18.5532 14.7245 18.2452 14.3207 17.9805C12.9961 17.1121 11.1 15.8189 11.2557 15.8967C9.95162 15.0373 10.4975 14.5111 11.2255 13.8093C11.3434 13.6957 11.466 13.5775 11.5863 13.4525C11.64 13.3967 11.9027 13.1524 12.2731 12.8081C13.4612 11.7035 15.7571 9.56903 15.8151 9.32202C15.8246 9.2815 15.8334 9.13045 15.7436 9.05068C15.6539 8.97092 15.5215 8.9982 15.4259 9.01989C15.2904 9.05064 13.1326 10.4769 8.95243 13.2986C8.33994 13.7192 7.78517 13.9242 7.28811 13.9134L7.29256 13.9156C6.63781 13.6847 5.9849 13.4859 5.32855 13.286C4.89736 13.1546 4.46469 13.0228 4.02904 12.8812C3.92249 12.8466 3.81853 12.8137 3.72083 12.783C8.24781 10.8109 11.263 9.51243 12.7739 8.884C14.9684 7.97124 16.2701 7.44551 17.0943 7.14643ZM19.5169 5.21806C19.2635 5.01244 18.985 4.91807 18.7915 4.87185C18.5917 4.82412 18.4018 4.80876 18.2578 4.8113C17.7814 4.81969 17.2697 4.95518 16.4121 5.26637C15.5373 5.58382 14.193 6.12763 12.0058 7.03736C10.4638 7.67874 7.39388 9.00115 2.80365 11.001C2.40046 11.1622 2.03086 11.3451 1.73884 11.5619C1.46919 11.7622 1.09173 12.1205 1.02268 12.6714C0.970519 13.0874 1.09182 13.4714 1.33782 13.7738C1.55198 14.037 1.82635 14.1969 2.03529 14.2981C2.34545 14.4483 2.76276 14.5791 3.12952 14.6941C3.70264 14.8737 4.27444 15.0572 4.84879 15.233C6.62691 15.7773 8.09066 16.2253 9.7012 17.2866C10.8825 18.0651 12.041 18.8775 13.2243 19.6531C13.6559 19.936 14.0593 20.2607 14.5049 20.5224C14.9916 20.8084 15.6104 21.0692 16.3636 20.9998C17.5019 20.8951 18.0941 19.8479 18.3331 18.5703C18.8552 15.7796 19.8909 9.68351 20.1332 7.13774C20.1648 6.80544 20.1278 6.433 20.097 6.25318C20.0653 6.068 19.9684 5.58448 19.5169 5.21806Z"></path>
                    </svg>
                `;
            const svgDefault = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 512" style="width: 16px;height: 16px;">
                    <path d="M280 64l40 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l40 0 9.6 0C121 27.5 153.3 0 192 0s71 27.5 78.4 64l9.6 0zM64 112c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16l-16 0 0 24c0 13.3-10.7 24-24 24l-88 0-88 0c-13.3 0-24-10.7-24-24l0-24-16 0zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                </svg>
                `;
            
            button.innerHTML = svg;
            buttonDefaultName.innerHTML = svgDefault;
            
            button.addEventListener('click', () => {
                const trElement = link.closest('tr');
                if (trElement) {
                    const externalIdSpan = trElement.querySelector('a[data-e2e="sortable-table-order-external-id"] > span');
                    const barcodeLinkDiv = trElement.querySelector('a[data-e2e="sortable-barcode-link"] div');
                    
                    if (barcodeLinkDiv) {
                        let textToCopy;
                        if (externalIdSpan) {
                            const externalIdText = externalIdSpan.textContent;
                            const barcodeText = barcodeLinkDiv.textContent;
                            textToCopy = `\`${externalIdText}\` (\`${barcodeText}\`)`;
                        } else {
                            const barcodeText = barcodeLinkDiv.textContent;
                            textToCopy = `\`${barcodeText}\``;
                        }
                        
                        navigator.clipboard.writeText(textToCopy)
                            .then(() => {
                                console.log(`Copied: ${textToCopy}`);
                                tpiNotification.show("Текст скопирован", "success", `Текст <span>${textToCopy}</span> успешно скопирован`);
                            })
                            .catch(err => {
                                console.error('Failed to copy text: ', err);
                                tpiNotification.show("Текст скопирован", "error", err);
                            });
                    }
                }
            });
            buttonDefaultName.addEventListener('click', () => {
                const trElement = link.closest('tr');
                if (trElement) {
                    const externalIdSpan = trElement.querySelector('a[data-e2e="sortable-table-order-external-id"] > span');
                    const barcodeLinkDiv = trElement.querySelector('a[data-e2e="sortable-barcode-link"] div');
                    
                    if (barcodeLinkDiv) {
                        let textToCopy;
                        if (externalIdSpan) {
                            const externalIdText = externalIdSpan.textContent;
                            const barcodeText = barcodeLinkDiv.textContent;
                            textToCopy = `${externalIdText} (${barcodeText})`;
                        } else {
                            const barcodeText = barcodeLinkDiv.textContent;
                            textToCopy = `${barcodeText}`;
                        }
                        
                        navigator.clipboard.writeText(textToCopy)
                            .then(() => {
                                console.log(`Copied: ${textToCopy}`);
                                tpiNotification.show("Текст скопирован", "success", `Текст <span>${textToCopy}</span> успешно скопирован`);
                            })
                            .catch(err => {
                                console.error('Failed to copy text: ', err);
                                tpiNotification.show("Текст скопирован", "error", err);
                            });
                    }
                }
            });
            
            parentDiv.parentNode.insertBefore(buttonDefaultName, parentDiv);
            parentDiv.parentNode.insertBefore(button, parentDiv);
        }
    });
}

let acceptPolybox_proection = false;

function changeSortablesLayout() {
    const targetElement = document.querySelector('div > div > div > div > div > span > span[data-e2e-i18n-key="pages.sorting-center-sortable:main-info.title"]');
    if (targetElement) {

        const topDiv = targetElement.closest('div').parentElement.parentElement.parentElement.parentElement.parentElement;
        if (topDiv) {
            // Добавляем новый класс
            topDiv.classList.add('diman__InfoPretier');
            
            // Находим и удаляем пустые div с классом ___unit_1dsct_1 внутри diman__InfoPretier
            const emptyUnits = topDiv.querySelectorAll('div.___unit_1dsct_1');
            emptyUnits.forEach(unit => {
                if (!unit.innerHTML.trim()) {
                    unit.remove();
                }
            });

            const makeOverflow = topDiv.parentElement.parentElement.parentElement
            makeOverflow.classList.add('diman__makeOverflow')
            makeOverflow.parentElement.classList.add("diman__makeGradientBorders")
            
            //* Получаем высоту заказа
            const heightElement = document.querySelector('div[data-e2e="weight-and-size-info-height"] > div:nth-child(2) > div');
            let orderHeight = heightElement ? heightElement.textContent.replace(/[^\d]/g, '').trim() : null;
            
            //* Получаем Ширины заказа
            const widthElement = document.querySelector('div[data-e2e="weight-and-size-info-width"] > div:nth-child(2) > div');
            let orderWidth = widthElement ? widthElement.textContent.replace(/[^\d]/g, '').trim() : null;
            
            //* Получаем Длину заказа
            const lengthElement = document.querySelector('div[data-e2e="weight-and-size-info-length"] > div:nth-child(2) > div');
            let orderLength = lengthElement ? lengthElement.textContent.replace(/[^\d]/g, '').trim() : null;
            
            //* Получаем Длину заказа
            const weightElement = document.querySelector('div[data-e2e="weight-and-size-info-weight"] > div:nth-child(2) > div');
            let orderWeight = weightElement ? weightElement.textContent.replace(/\s/g, '') : "error";

            let proectionScale = 1;

            if(orderHeight > 20 || orderWidth > 30 || orderLength > 30){
                proectionScale = .7
            } else if(orderHeight > 50 || orderWidth > 50 || orderLength > 50){
                proectionScale = .45
            }

            if(orderHeight && orderWidth && orderLength && orderWeight){
                if (!topDiv.querySelector('.proection3DContainer')) {
                    const checkIfOrphanLot = document.querySelector("span[data-e2e-i18n-key=\"common.sorting-center:sortable-type.ORPHAN_PALLET\"]")
                    const checkIfPolybox = document.querySelector("span[data-e2e-i18n-key=\"common.sorting-center:sortable-type.POLYBOX\"]")
      
                    console.log(checkIfOrphanLot)
                    console.log(checkIfPolybox)

                    let infoPretier = document.querySelector(".diman__InfoPretier")
                    let proection3DContainer = document.createElement("div")
                    proection3DContainer.classList.add("proection3DContainer")
                    infoPretier.appendChild(proection3DContainer)

                    if(!checkIfPolybox && !checkIfOrphanLot){
                        proection3DContainer.innerHTML = `
                        <div class="proection3DContainer-info">
                            <p>Примерная проэкция ВГХ в 3D</p>
                        </div>
                        <div class="proection3DContainer-preview">
                            <div class="proection3DContainer-preview-bordersOverflow-y" style="left: 0;"></div>
                            <div class="proection3DContainer-preview-bordersOverflow-y" style="right: 0;"></div>
                            <div class="proection3DContainer-preview-bordersOverflow-x" style="top: 0;"></div>
                            <div class="proection3DContainer-preview-bordersOverflow-x" style="bottom: 0;"></div>
                            <div class="diman_pro" style="--dimanWidth: calc(${orderWidth + "px"} * var(--dimanScale)); --dimanLength: calc(${orderLength + "px"} * var(--dimanScale)); --dimanHeight: calc(${orderHeight + "px"} * var(--dimanScale)); --dimanScale: ${proectionScale};">
                                <div class="diman__orderWeight">
                                    ${orderWeight}
                                </div>
                                <div class="diman__orderWeight">
                                    ${orderWeight}
                                </div>
                                <div class="wdh-side wdhMain"></div>
                                <div class="wdh-side wdhMain"></div>
                                <div class="wdh-side wdhMain"></div>
                                <div class="wdh-side wdhMain"></div>
                                <div class="wdh-top wdhMain"></div>
                                <div class="wdh-bottom wdhMain"></div>
                            </div>
                        </div>
                        <div class="diman_scaleButtons">
                                <button class="diman_ScalePlus">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM184 296c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z"/>
                                    </svg>
                                </button>
                                <button class="diman_ScaleMinus">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM136 184c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"/>
                                    </svg>
                                </button>
                                <button class="diman_Rotate">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M256 96c38.4 0 73.7 13.5 101.3 36.1l-32.6 32.6c-4.6 4.6-5.9 11.5-3.5 17.4s8.3 9.9 14.8 9.9l112 0c8.8 0 16-7.2 16-16l0-112c0-6.5-3.9-12.3-9.9-14.8s-12.9-1.1-17.4 3.5l-34 34C363.4 52.6 312.1 32 256 32c-10.9 0-21.5 .8-32 2.3l0 64.9c10.3-2.1 21-3.2 32-3.2zM132.1 154.7l32.6 32.6c4.6 4.6 11.5 5.9 17.4 3.5s9.9-8.3 9.9-14.8l0-112c0-8.8-7.2-16-16-16L64 48c-6.5 0-12.3 3.9-14.8 9.9s-1.1 12.9 3.5 17.4l34 34C52.6 148.6 32 199.9 32 256c0 10.9 .8 21.5 2.3 32l64.9 0c-2.1-10.3-3.2-21-3.2-32c0-38.4 13.5-73.7 36.1-101.3zM477.7 224l-64.9 0c2.1 10.3 3.2 21 3.2 32c0 38.4-13.5 73.7-36.1 101.3l-32.6-32.6c-4.6-4.6-11.5-5.9-17.4-3.5s-9.9 8.3-9.9 14.8l0 112c0 8.8 7.2 16 16 16l112 0c6.5 0 12.3-3.9 14.8-9.9s1.1-12.9-3.5-17.4l-34-34C459.4 363.4 480 312.1 480 256c0-10.9-.8-21.5-2.3-32zM256 416c-38.4 0-73.7-13.5-101.3-36.1l32.6-32.6c4.6-4.6 5.9-11.5 3.5-17.4s-8.3-9.9-14.8-9.9L64 320c-8.8 0-16 7.2-16 16l0 112c0 6.5 3.9 12.3 9.9 14.8s12.9 1.1 17.4-3.5l34-34C148.6 459.4 199.9 480 256 480c10.9 0 21.5-.8 32-2.3l0-64.9c-10.3 2.1-21 3.2-32 3.2z"></path>
                                    </svg>
                                </button>
                                <span class="diman_scaleButtons-devider"></span>
                                <button class="diman_animationControl">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                        <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/>
                                    </svg>
                                </button>
                            </div>
                        <div class="proection3dContainer-infoText">
                            <svg class="proection3dContainer-infoText-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                            </svg>
                            <p class="proection3dContainer-infoText-text">ВГХ заказов иногда не соответствует реальному размеру заказа</p>
                        </div>
                        <div class="proection3dContainer-wdh-data">
                            <div class="wdh-data-item" wdh-data="height">
                                <i class="wdh-data-icon"></i>
                                <div class="wdh-data-title">Высота</div>
                                <div class="wdh-data-variable">${orderHeight + "см"}</div>
                            </div>
                            <div class="wdh-data-item" wdh-data="width">
                                <i class="wdh-data-icon"></i>
                                <div class="wdh-data-title">Ширина</div>
                                <div class="wdh-data-variable">${orderWidth + "см"}</div>
                            </div>
                            <div class="wdh-data-item" wdh-data="length">
                                <i class="wdh-data-icon"></i>
                                <div class="wdh-data-title">Длина</div>
                                <div class="wdh-data-variable">${orderLength + "см"}</div>
                            </div>
                        </div>
                        `
                    }else if(checkIfPolybox || checkIfOrphanLot){
                        
                        proection3DContainer.innerHTML = `
                        <div class="proection3DContainer-info">
                            <p>Примерная проэкция ВГХ в 3D</p>
                        </div>
                        <div class="proection3DContainer-preview">
                            <div class="proection3DContainer-preview-bordersOverflow-y" style="left: 0;"></div>
                            <div class="proection3DContainer-preview-bordersOverflow-y" style="right: 0;"></div>
                            <div class="proection3DContainer-preview-bordersOverflow-x" style="top: 0;"></div>
                            <div class="proection3DContainer-preview-bordersOverflow-x" style="bottom: 0;"></div>
                            <div class="proection3D-show-me-proection">Отобразить проэкцию</div>
                        </div>
                        <div class="diman_scaleButtons">
                                <button class="diman_ScalePlus">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM184 296c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z"/>
                                    </svg>
                                </button>
                                <button class="diman_ScaleMinus">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM136 184c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"/>
                                    </svg>
                                </button>
                                <button class="diman_Rotate">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M256 96c38.4 0 73.7 13.5 101.3 36.1l-32.6 32.6c-4.6 4.6-5.9 11.5-3.5 17.4s8.3 9.9 14.8 9.9l112 0c8.8 0 16-7.2 16-16l0-112c0-6.5-3.9-12.3-9.9-14.8s-12.9-1.1-17.4 3.5l-34 34C363.4 52.6 312.1 32 256 32c-10.9 0-21.5 .8-32 2.3l0 64.9c10.3-2.1 21-3.2 32-3.2zM132.1 154.7l32.6 32.6c4.6 4.6 11.5 5.9 17.4 3.5s9.9-8.3 9.9-14.8l0-112c0-8.8-7.2-16-16-16L64 48c-6.5 0-12.3 3.9-14.8 9.9s-1.1 12.9 3.5 17.4l34 34C52.6 148.6 32 199.9 32 256c0 10.9 .8 21.5 2.3 32l64.9 0c-2.1-10.3-3.2-21-3.2-32c0-38.4 13.5-73.7 36.1-101.3zM477.7 224l-64.9 0c2.1 10.3 3.2 21 3.2 32c0 38.4-13.5 73.7-36.1 101.3l-32.6-32.6c-4.6-4.6-11.5-5.9-17.4-3.5s-9.9 8.3-9.9 14.8l0 112c0 8.8 7.2 16 16 16l112 0c6.5 0 12.3-3.9 14.8-9.9s1.1-12.9-3.5-17.4l-34-34C459.4 363.4 480 312.1 480 256c0-10.9-.8-21.5-2.3-32zM256 416c-38.4 0-73.7-13.5-101.3-36.1l32.6-32.6c4.6-4.6 5.9-11.5 3.5-17.4s-8.3-9.9-14.8-9.9L64 320c-8.8 0-16 7.2-16 16l0 112c0 6.5 3.9 12.3 9.9 14.8s12.9 1.1 17.4-3.5l34-34C148.6 459.4 199.9 480 256 480c10.9 0 21.5-.8 32-2.3l0-64.9c-10.3 2.1-21 3.2-32 3.2z"></path>
                                    </svg>
                                </button>
                                <span class="diman_scaleButtons-devider"></span>
                                <button class="diman_animationControl">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                        <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/>
                                    </svg>
                                </button>
                            </div>
                        <div class="proection3dContainer-infoText">
                            <svg class="proection3dContainer-infoText-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                            </svg>
                            <p class="proection3dContainer-infoText-text">ВГХ заказов иногда не соответствует реальному размеру заказа</p>
                        </div>
                        <div class="proection3dContainer-wdh-data">
                            <div class="wdh-data-item" wdh-data="height">
                                <i class="wdh-data-icon"></i>
                                <div class="wdh-data-title">Высота</div>
                                <div class="wdh-data-variable">${orderHeight + "см"}</div>
                            </div>
                            <div class="wdh-data-item" wdh-data="width">
                                <i class="wdh-data-icon"></i>
                                <div class="wdh-data-title">Ширина</div>
                                <div class="wdh-data-variable">${orderWidth + "см"}</div>
                            </div>
                            <div class="wdh-data-item" wdh-data="length">
                                <i class="wdh-data-icon"></i>
                                <div class="wdh-data-title">Длина</div>
                                <div class="wdh-data-variable">${orderLength + "см"}</div>
                            </div>
                        </div>
                        `
                    }
                    removeDivWithNestedWeightAndSizeInfo()

                    function makeMyDayEasey(){
                        if(document.querySelector(".proection3D-show-me-proection")) {
                            const proection3D_show_me_polybox = document.querySelector(".proection3D-show-me-proection")
                            proection3D_show_me_polybox.addEventListener("click", ()=>{
                                acceptPolybox_proection = true
                                proectionScale = .25
                                proection3DContainer.innerHTML = `
                                <div class="proection3DContainer-info">
                                    <p>Примерная проэкция ВГХ в 3D</p>
                                </div>
                                <div class="proection3DContainer-preview">
                                    <div class="proection3DContainer-preview-bordersOverflow-y" style="left: 0;"></div>
                                    <div class="proection3DContainer-preview-bordersOverflow-y" style="right: 0;"></div>
                                    <div class="proection3DContainer-preview-bordersOverflow-x" style="top: 0;"></div>
                                    <div class="proection3DContainer-preview-bordersOverflow-x" style="bottom: 0;"></div>
                                    <div class="diman_pro" style="--dimanWidth: calc(${orderWidth + "px"} * var(--dimanScale)); --dimanLength: calc(${orderLength + "px"} * var(--dimanScale)); --dimanHeight: calc(${orderHeight + "px"} * var(--dimanScale)); --dimanScale: ${proectionScale};">
                                        <div class="diman__orderWeight">
                                            ${orderWeight}
                                        </div>
                                        <div class="diman__orderWeight">
                                            ${orderWeight}
                                        </div>
                                        <div class="wdh-side wdhMain"></div>
                                        <div class="wdh-side wdhMain"></div>
                                        <div class="wdh-side wdhMain"></div>
                                        <div class="wdh-side wdhMain"></div>
                                        <div class="wdh-top wdhMain"></div>
                                        <div class="wdh-bottom wdhMain"></div>
                                    </div>
                                </div>
                                <div class="diman_scaleButtons">
                                        <button class="diman_ScalePlus">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM184 296c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z"/>
                                            </svg>
                                        </button>
                                        <button class="diman_ScaleMinus">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM136 184c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"/>
                                            </svg>
                                        </button>
                                        <button class="diman_Rotate">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M256 96c38.4 0 73.7 13.5 101.3 36.1l-32.6 32.6c-4.6 4.6-5.9 11.5-3.5 17.4s8.3 9.9 14.8 9.9l112 0c8.8 0 16-7.2 16-16l0-112c0-6.5-3.9-12.3-9.9-14.8s-12.9-1.1-17.4 3.5l-34 34C363.4 52.6 312.1 32 256 32c-10.9 0-21.5 .8-32 2.3l0 64.9c10.3-2.1 21-3.2 32-3.2zM132.1 154.7l32.6 32.6c4.6 4.6 11.5 5.9 17.4 3.5s9.9-8.3 9.9-14.8l0-112c0-8.8-7.2-16-16-16L64 48c-6.5 0-12.3 3.9-14.8 9.9s-1.1 12.9 3.5 17.4l34 34C52.6 148.6 32 199.9 32 256c0 10.9 .8 21.5 2.3 32l64.9 0c-2.1-10.3-3.2-21-3.2-32c0-38.4 13.5-73.7 36.1-101.3zM477.7 224l-64.9 0c2.1 10.3 3.2 21 3.2 32c0 38.4-13.5 73.7-36.1 101.3l-32.6-32.6c-4.6-4.6-11.5-5.9-17.4-3.5s-9.9 8.3-9.9 14.8l0 112c0 8.8 7.2 16 16 16l112 0c6.5 0 12.3-3.9 14.8-9.9s1.1-12.9-3.5-17.4l-34-34C459.4 363.4 480 312.1 480 256c0-10.9-.8-21.5-2.3-32zM256 416c-38.4 0-73.7-13.5-101.3-36.1l32.6-32.6c4.6-4.6 5.9-11.5 3.5-17.4s-8.3-9.9-14.8-9.9L64 320c-8.8 0-16 7.2-16 16l0 112c0 6.5 3.9 12.3 9.9 14.8s12.9 1.1 17.4-3.5l34-34C148.6 459.4 199.9 480 256 480c10.9 0 21.5-.8 32-2.3l0-64.9c-10.3 2.1-21 3.2-32 3.2z"></path>
                                            </svg>
                                        </button>
                                        <span class="diman_scaleButtons-devider"></span>
                                        <button class="diman_animationControl">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/>
                                            </svg>
                                        </button>
                                        <button class="diman_hideProection">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                                <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/>
                                            </svg> 
                                        </button>
                                    </div>
                                <div class="proection3dContainer-infoText">
                                    <svg class="proection3dContainer-infoText-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                                    </svg>
                                    <p class="proection3dContainer-infoText-text">ВГХ заказов иногда не соответствует реальному размеру заказа</p>
                                </div>
                                <div class="proection3dContainer-wdh-data">
                                    <div class="wdh-data-item" wdh-data="height">
                                        <i class="wdh-data-icon"></i>
                                        <div class="wdh-data-title">Высота</div>
                                        <div class="wdh-data-variable">${orderHeight + "см"}</div>
                                    </div>
                                    <div class="wdh-data-item" wdh-data="width">
                                        <i class="wdh-data-icon"></i>
                                        <div class="wdh-data-title">Ширина</div>
                                        <div class="wdh-data-variable">${orderWidth + "см"}</div>
                                    </div>
                                    <div class="wdh-data-item" wdh-data="length">
                                        <i class="wdh-data-icon"></i>
                                        <div class="wdh-data-title">Длина</div>
                                        <div class="wdh-data-variable">${orderLength + "см"}</div>
                                    </div>
                                </div>
                                `
                                addManipulationListeners()
                            })
                        }
                    }
                    if(document.querySelector("span[data-e2e-i18n-key=\"common.sorting-center:sortable-type.POLYBOX\"]")) makeMyDayEasey()
                    else if(document.querySelector("span[data-e2e-i18n-key=\"common.sorting-center:sortable-type.ORPHAN_PALLET\"]")) makeMyDayEasey()

                    function addManipulationListeners(){
                        const diman_ScalePlus = document.querySelector(".diman_ScalePlus");
                        const diman_ScaleMinus = document.querySelector(".diman_ScaleMinus");
                        const diman_Rotate = document.querySelector(".diman_Rotate");
                        const diman_animationControl = document.querySelector(".diman_animationControl");
                        const dimanProElement = document.querySelector(".diman_pro");
                        let isPaused = false

                        if (diman_ScalePlus && diman_ScaleMinus && dimanProElement) {
                            diman_ScalePlus.addEventListener('click', () => {
                                proectionScale += 0.05;  // Увеличиваем на 0.1
                                updateScale();
                            });

                            diman_ScaleMinus.addEventListener('click', () => {
                                proectionScale = Math.max(0.05, proectionScale - 0.05);  // Уменьшаем на 0.1, минимальное значение 0.1
                                updateScale();
                            });

                            diman_Rotate.addEventListener('click', () => {
                                let tempOrderHeight
                                let tempOrderWidth
                                let tempOrderLength
                                let rotateState = 0;
                                
                                if(rotateState === 0){
                                    tempOrderHeight = orderHeight
                                    tempOrderWidth = orderWidth
                                    tempOrderLength = orderLength

                                    orderHeight = tempOrderWidth
                                    orderWidth = tempOrderLength
                                    orderLength = tempOrderHeight
                                    rotateState = 1
                                }else if(rotateState === 1){
                                    tempOrderHeight = orderHeight
                                    tempOrderWidth = orderWidth
                                    tempOrderLength = orderLength
                                    
                                    orderHeight = tempOrderLength
                                    orderWidth = tempOrderHeight
                                    orderLength = tempOrderWidth

                                    rotateState = 2
                                }else if(rotateState === 2){
                                    orderHeight = heightElement ? heightElement.textContent.replace(/[^\d]/g, '').trim() : null;
                                    orderWidth = widthElement ? widthElement.textContent.replace(/[^\d]/g, '').trim() : null;
                                    orderLength = lengthElement ? lengthElement.textContent.replace(/[^\d]/g, '').trim() : null;
                                    
                                    rotateState = 0
                                }
                                
                                updateRotation();
                            });

                            diman_animationControl.addEventListener('click', () => {
                                if(isPaused === false){
                                    dimanProElement.classList.add('isPaused')
                                    diman_animationControl.innerHTML =`
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                        <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
                                    </svg>
                                    `
                                    isPaused = true
                                }else if(isPaused === true){
                                    dimanProElement.classList.remove('isPaused')
                                    diman_animationControl.innerHTML =`
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                        <path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/>
                                    </svg>
                                    `
                                    isPaused = false
                                }
                            });

                            function updateScale() {
                                dimanProElement.style.setProperty('--dimanScale', proectionScale);
                            }
                            function updateRotation() {
                                dimanProElement.style.setProperty('--dimanScale', proectionScale);
                                dimanProElement.style.setProperty('--dimanHeight', `calc(${orderHeight}px * var(--dimanScale))`);
                                dimanProElement.style.setProperty('--dimanWidth', `calc(${orderWidth}px * var(--dimanScale))`);
                                dimanProElement.style.setProperty('--dimanLength', `calc(${orderLength}px * var(--dimanScale))`);
                            }

                            if(document.querySelector(".diman_hideProection")){
                                document.querySelector(".diman_hideProection").addEventListener("click", ()=>{
                                    document.querySelector(".proection3DContainer-preview").innerHTML = `
                                        <div class="proection3DContainer-preview-bordersOverflow-y" style="left: 0;"></div>
                                        <div class="proection3DContainer-preview-bordersOverflow-y" style="right: 0;"></div>
                                        <div class="proection3DContainer-preview-bordersOverflow-x" style="top: 0;"></div>
                                        <div class="proection3DContainer-preview-bordersOverflow-x" style="bottom: 0;"></div>
                                        <div class="proection3D-show-me-proection">Отобразить проэкцию</div>
                                    `
                                    if(document.querySelector(".diman_hideProection")) document.querySelector(".diman_hideProection").remove()
                                        if(document.querySelector("span[data-e2e-i18n-key=\"common.sorting-center:sortable-type.POLYBOX\"]")) makeMyDayEasey()
                                        else if(document.querySelector("span[data-e2e-i18n-key=\"common.sorting-center:sortable-type.ORPHAN_PALLET\"]")) makeMyDayEasey()
                                })
                            }
                        }
                    }
                    addManipulationListeners()
                }
            }
        }
    }
}

function removeDivWithNestedWeightAndSizeInfo() {
    const targetSelectors = [
        'div[data-e2e="weight-and-size-info-height"]',
        'div[data-e2e="weight-and-size-info-width"]',
      'div[data-e2e="weight-and-size-info-length"]',
      'div[data-e2e="weight-and-size-info-weight"]'
    ];
  
    // Найдём все возможные внутренние элементы
    const allTargetElements = targetSelectors.flatMap(selector =>
      Array.from(document.querySelectorAll(selector))
    );
  
    allTargetElements.forEach(targetEl => {
      let current = targetEl;
      // Поднимаемся на два уровня вверх
      for (let i = 0; i < 4; i++) {
        if (current.parentElement) {
          current = current.parentElement;
        } else {
            console.log("💰")
          return;
        }
      }
  
      // Удаляем родительский div, если он существует
      if (current && current.tagName === 'DIV') {
        current.remove();
      }
    });
  }

function sortableInfo__extraInfo(){
    const sortableInfo = document.querySelector("div[data-tid=\"66fcbac9 cb97fdce d276ac8a ee6163ae ffc13b80\"] div")
    const checkIsOrder = document.querySelector("span[data-e2e-i18n-key=\"common.sorting-center:sortable-type.PLACE\"]")
    const createExtraInfo_1 = document.createElement("div")
    const createExtraInfo_2 = document.createElement("div")
    const createExtraInfo_3 = document.createElement("div")

    if (preview__stopExtraCheck) return false;
    preview__checkAttempts++;
    if (preview__checkAttempts >= preview__maxAttempts) {
        preview__stopExtraCheck = true;
    }

    if(checkIsOrder && checkIsOrder.innerText.trim() === "Посылка"){
        if(!document.getElementById("extraOrderNameData")){
            createExtraInfo_1.classList.add("sortbaleInfo_extra_wrapper")
            createExtraInfo_1.id ="extraOrderNameData"
            createExtraInfo_1.innerHTML = `
                <div class="extraInfoTitle">Номер заказа</div>
                <a class="extraInfoValue__link" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width: 18px; height: 18px; display: flex; color: #212121;">
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="40" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                        </circle>
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="100" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                        </circle>
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="160" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                        </circle>
                    </svg>
                </a>
            `
            if (sortableInfo) sortableInfo.appendChild(createExtraInfo_1);
            else return false;

            createExtraInfo_2.classList.add("sortbaleInfo_extra_wrapper")
            createExtraInfo_2.id ="extraOrderSortableData"
            createExtraInfo_2.innerHTML = `
                <div class="extraInfoTitle">Код грузоместа</div>
                <a class="extraInfoValue__link" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width: 18px; height: 18px; display: flex; color: #212121;">
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="40" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                        </circle>
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="100" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                        </circle>
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="160" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                        </circle>
                    </svg>
                </a>
            `
            if (sortableInfo) sortableInfo.appendChild(createExtraInfo_2);
            else return false;

            createExtraInfo_3.classList.add("sortbaleInfo_extra_wrapper")
            createExtraInfo_3.id ="extraOrderСrossData"
            createExtraInfo_3.innerHTML = `
                <div class="extraInfoTitle">Кросс-док потоварка</div>
                <p class="extraInfoValue__link" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width: 18px; height: 18px; display: flex; color: #212121;">
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="40" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                        </circle>
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="100" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                        </circle>
                        <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="160" cy="100">
                            <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                        </circle>
                    </svg>
                </p>
            `
            if (sortableInfo) sortableInfo.appendChild(createExtraInfo_3);
            else return false;
        }
    }else{
        return false;
    }
}

let preview__checkAttempts = 0;
const preview__maxAttempts = 10;
let preview__stopExtraCheck = false;

const preview__intervalId = setInterval(() => {
    const success = sortableInfo__extraInfo();
    if (success || preview__stopExtraCheck) {
        clearInterval(preview__intervalId);
    }
}, 5000);

let missedShipping__checkAttempts = 0;
const missedShipping__maxAttempts = 10;
let missedShipping__stopExtraCheck = false;

const missedShipping__intervalId = setInterval(() => {
    const success = sortableInfo__extraInfo();
    if (success || missedShipping__stopExtraCheck) {
        clearInterval(missedShipping__intervalId);
    }
}, 5000);

//A-
//A- Добавить информацию о засылах
//A-

function missedShipping(){
    if (missedShipping__stopExtraCheck) return false;
    missedShipping__checkAttempts++;
    if (missedShipping__checkAttempts >= missedShipping__maxAttempts) {
        missedShipping__stopExtraCheck = true;
    }

    // //TODO ••••••• LIPETSK
    // if(!document.querySelector(".iframe__missedShipping__lipetsk")){
    //     const iframe__missedShipping__lipetsk = document.createElement("iframe");
    //     iframe__missedShipping__lipetsk.classList.add("iframe__missedShipping__lipetsk");
    //     iframe__missedShipping__lipetsk.style.position = "absolute";
    //     iframe__missedShipping__lipetsk.style.left = "-10px";
    //     iframe__missedShipping__lipetsk.style.top = "-10px";
    //     iframe__missedShipping__lipetsk.style.zIndex = "-9999999";
    //     iframe__missedShipping__lipetsk.style.width = "1px";
    //     iframe__missedShipping__lipetsk.style.height = "1px";
    //     iframe__missedShipping__lipetsk.setAttribute("sandbox", "allow-scripts allow-same-origin");

    //     iframe__missedShipping__lipetsk.src = `https://logistics.market.yandex.ru/sorting-center/21972131/sortables`;
    //     document.body.prepend(iframe__missedShipping__lipetsk);

    //     iframe__missedShipping__lipetsk.onload = () => {
    //         console.log("🔥 iframe Липецка загружен !")
    //     }
    // }else return
    // //TODO ••••••• LIPETSK END

    // //TODO ••••••• KURSK
    // if(!document.querySelector(".iframe__missedShipping__kursk")){
    //     const iframe__missedShipping__kursk = document.createElement("iframe");
    //     iframe__missedShipping__kursk.classList.add("iframe__missedShipping__kursk");
    //     iframe__missedShipping__kursk.style.position = "absolute";
    //     iframe__missedShipping__kursk.style.left = "-10px";
    //     iframe__missedShipping__kursk.style.top = "-10px";
    //     iframe__missedShipping__kursk.style.zIndex = "-9999999";
    //     iframe__missedShipping__kursk.style.width = "1px";
    //     iframe__missedShipping__kursk.style.height = "1px";
    //     iframe__missedShipping__kursk.setAttribute("sandbox", "allow-scripts allow-same-origin");

    //     iframe__missedShipping__kursk.src = `https://logistics.market.yandex.ru/sorting-center/22048284/sortables`;
    //     document.body.prepend(iframe__missedShipping__kursk);

    //     iframe__missedShipping__kursk.onload = () => {
    //         console.log("🔥 iframe Курска загружен !")
    //     }
    // }else return
    // //TODO ••••••• KURSK END

    // //TODO ••••••• BELGOROD
    // if(!document.querySelector(".iframe__missedShipping__belgorod")){
    //     const iframe__missedShipping__belgorod = document.createElement("iframe");
    //     iframe__missedShipping__belgorod.classList.add("iframe__missedShipping__belgorod");
    //     iframe__missedShipping__belgorod.style.position = "absolute";
    //     iframe__missedShipping__belgorod.style.left = "-10px";
    //     iframe__missedShipping__belgorod.style.top = "-10px";
    //     iframe__missedShipping__belgorod.style.zIndex = "-9999999";
    //     iframe__missedShipping__belgorod.style.width = "1px";
    //     iframe__missedShipping__belgorod.style.height = "1px";
    //     iframe__missedShipping__belgorod.setAttribute("sandbox", "allow-scripts allow-same-origin");

    //     iframe__missedShipping__belgorod.src = `https://logistics.market.yandex.ru/sorting-center/22006379/sortables`;
    //     document.body.prepend(iframe__missedShipping__belgorod);

    //     iframe__missedShipping__belgorod.onload = () => {
    //         console.log("🔥 iframe Белгорода загружен !")
    //     }
    // }else return
    // //TODO ••••••• BELGOROD END

    // const finForMe_diman__InfoPretier = document.querySelector('.diman__InfoPretier');
    // if (finForMe_diman__InfoPretier) {

    //     if (!finForMe_diman__InfoPretier.querySelector('.missedShippingContainer')) {
    //         let missedShippingContainer = document.createElement("div");
    //         missedShippingContainer.classList.add("missedShippingContainer")
    //         missedShippingContainer.innerHTML = `
    //             <div class="missedShipping-title">
    //                 <p>Проверка на засыл</p>
    //             </div>
    //             <div class="temp_missedShipping-loading">
    //                 <button class="diman__missedShipping__search ">Найти</button>
    //                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    //                     <radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
    //                         <stop offset="0" stop-color="#2B2B2B"></stop>
    //                         <stop offset=".3" stop-color="#2B2B2B" stop-opacity=".9"></stop>
    //                         <stop offset=".6" stop-color="#2B2B2B" stop-opacity=".6"></stop>
    //                         <stop offset=".8" stop-color="#2B2B2B" stop-opacity=".3"></stop>
    //                         <stop offset="1" stop-color="#2B2B2B" stop-opacity="0"></stop>
    //                     </radialGradient>
    //                     <circle transform-origin="center" fill="none" stroke="url(#a12)" stroke-width="17" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70">
    //                         <animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform>
    //                     </circle>
    //                     <circle transform-origin="center" fill="none" opacity=".2" stroke="#2B2B2B" stroke-width="17" stroke-linecap="round" cx="100" cy="100" r="70"></circle>
    //                 </svg>
    //             </div>
    //         `
    //         document.querySelector('.diman__InfoPretier').appendChild(missedShippingContainer)
    //     }
    // }
}

//A-
//A- Добавить информацию о засылах END
//A-

//B- 
//B- Найти сканы в грузоместах 
//B- 


let sotableScanlog__find__FOUND = false
function searchSortablesScanlog() {
    
    const findTarget = () => {
      return Array.from(
        document.querySelectorAll('.p-layout__header-title-wrapper')
      ).find(el => el.textContent.trim() === 'Грузоместа');
    };
  
    if (findTarget() && sotableScanlog__find__FOUND == false) {
      sotableScanlog__find__FOUND = true
      return;
    } else return
  
    
    // const sotableScanlog__find__MAX = 5;
    // let sotableScanlog__find__ATTEMPTS = 0;
    // const timerId = setInterval(() => {
    //   sotableScanlog__find__ATTEMPTS += 1;
  
    //   if (findTarget() && sotableScanlog__find__FOUND == false) {
    //     console.log('[🟡sortablesScanlog] Найден элемент');
    //     sotableScanlog__find__FOUND = true
    //     clearInterval(timerId);
    //   } else if (sotableScanlog__find__ATTEMPTS >= sotableScanlog__find__MAX && sotableScanlog__find__FOUND == false) {
    //     console.log(`[🟡sortablesScanlog] Элемент не найден после ${sotableScanlog__find__MAX} попыток`);
    //     clearInterval(timerId);
    //   } else return
    // }, 200);
}
  

//B- 
//B- Найти сканы в грузоместах END
//B- 

//?????????????????
//?????????????????
//?????????????????
// Делаем скриншот
async function takeScreenshot() {
    const targetElement = document.querySelector('.diman__scanLog__wrapper');
    if (!targetElement) {
      alert('Элемент .diman__scanLog__wrapper не найден!');
      return;
    }
  
    try {
      // 1. Делаем скриншот
      const canvas = await html2canvas(targetElement, {
        useCORS: true,
        scale: 1,
        logging: true,
      });
  
      // 2. Копируем в буфер обмена
      canvas.toBlob(async (blob) => {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        
        // 3. Показываем уведомление
        alert('Скриншот скопирован в буфер обмена!');
      });
  
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при создании скриншота!');
    }
  }
//????????????????? END
//????????????????? END
//????????????????? END


//C-
//C- Скачаивание файла .xlsx с сервера YM END END END
//C-

function processHeaders() {
    document.querySelectorAll('.p-layout__header-inner').forEach(headerInner => {
        headerInner.querySelectorAll('div').forEach(div => {
            const textNode = Array.from(div.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            const match = textNode?.textContent.match(/Грузоместо № ([^\s<]+)/);
            if (match) {

                const historyDownload_default_button = document.querySelector('div a[icon="fileDownload"]')
                if (historyDownload_default_button) {
                    const grandParent = historyDownload_default_button.parentElement?.parentElement
                
                    const isAlreadyInserted =
                        grandParent.querySelector(".isLoading__default") ||
                        grandParent.querySelector(".isLoading__sortable")
                
                    if (grandParent && !isAlreadyInserted) {
                        // Первая кнопка (default)
                        const newPreloading__wrapper1 = document.createElement("div")
                        newPreloading__wrapper1.classList.add("isLoading__default")
                        newPreloading__wrapper1.classList.add("isLoading__forCopyDefault")
                        newPreloading__wrapper1.innerHTML = `
                            <button class="isLoading__default__button" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width: 18px; height: 18px; display: flex; color: #212121;" class="orderLoadingSVG">
                                    <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="40" cy="100">
                                        <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                                    </circle>
                                    <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="100" cy="100">
                                        <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                                    </circle>
                                    <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="160" cy="100">
                                        <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                                    </circle>
                                </svg>
                            </button>
                        `
                    
                        // Вторая кнопка (sortable)
                        const newPreloading__wrapper2 = document.createElement("div")
                        newPreloading__wrapper2.classList.add("isLoading__sortable")
                        newPreloading__wrapper2.classList.add("isLoading__forCopySortable")
                        newPreloading__wrapper2.innerHTML = `
                            <button class="isLoading__sortable__button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width: 18px; height: 18px; display: flex; color: #212121;">
                                    <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="40" cy="100">
                                        <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                                    </circle>
                                    <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="100" cy="100">
                                        <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                                    </circle>
                                    <circle fill="#212121" stroke="#212121" stroke-width="16" r="15" cx="160" cy="100">
                                        <animate attributeName="opacity" calcMode="spline" dur="1.3" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                                    </circle>
                                </svg>
                            </button>
                        `
                    
                        // Вставляем кнопки перед ссылкой
                        const parentDiv = historyDownload_default_button.closest("div")
                        const grandParent = parentDiv?.parentElement
                        const dimanButton__telegram__copy__button = document.querySelector(".dimanButton__telegram__copy__button ")
                            if(!dimanButton__telegram__copy__button){
                                grandParent.insertBefore(newPreloading__wrapper1, parentDiv)
                                grandParent.insertBefore(newPreloading__wrapper2, parentDiv)
                            }else{
                                return
                            }
                    } else {
                        return
                    }
                } else {
                    return
                }           

                const diman__currentSortable = match?.[1];

                if (!div.classList.contains('diman__sortable')) {
                    div.classList.add('diman__sortable');
                }

                // Проверка наличия iframe с классом diman-search-type__sortable
                const existingIframe = document.querySelector('iframe.diman-search-type__sortable');
                if (existingIframe) {
                    return;
                }

                // Добавление iframe в начало body
                let retryCount = 0;
                const maxRetries = 3;
                
                function createIframe() {
                    if (retryCount >= maxRetries) {
                        return;
                    }
                
                    // Удаляем старый iframe, если есть
                    const oldIframe = document.querySelector('iframe.diman-search-type__sortable');
                    if (oldIframe) oldIframe.remove();
                
                    const iframe = document.createElement('iframe');
                    iframe.width = "1";
                    iframe.height = "1";
                    iframe.src = `https://logistics.market.yandex.ru/sorting-center/21972131/sortables?sortableTypes=all&sortableStatuses=&sortableStatusesLeafs=&orderExternalId=&inboundIdTitle=&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=&sortableBarcode=${diman__currentSortable}`;
                    iframe.classList.add('diman-search-type__sortable');
                    iframe.style.position = "absolute";
                    iframe.style.top = "-9999px";
                    iframe.style.left = "-9999px";
                    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
                
                    document.body.prepend(iframe);
                
                    iframe.onload = () => {
                        try {
                            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                
                            const intervalId = setInterval(() => {
                                try {
                                    const targetElement = iframeDocument.querySelector('[data-e2e="sortable-table-order-external-id"] span');
                                    if (targetElement) {
                                        const diman__currentOrder = targetElement.textContent.trim();
                                        // checkFOS__data(diman__currentOrder, diman__currentSortable)
                                        setTimeout(() => {
                                            if(diman__currentOrder){
                                                document.querySelector("iframe.diman-search-type__sortable").remove()
                                            }
                                        }, 500);
                                        clearInterval(intervalId);
                
                                        if(document.querySelector(".isLoading__default") && document.querySelector(".isLoading__sortable")){
                                            const dimanNewButton__default = document.querySelector(".isLoading__default")
                                            const dimanNewButton__sortable = document.querySelector(".isLoading__sortable")
                
                                            dimanNewButton__default.classList.remove("isLoading__default")
                                            dimanNewButton__sortable.classList.remove("isLoading__sortable")
                
                                            dimanNewButton__default.classList.add("dimanButton__default__copy")
                                            dimanNewButton__sortable.classList.add("dimanButton__telegram__copy")
                
                                            dimanNewButton__default.innerHTML = `
                                                <button class="dimanButton__default__copy__button copyOrderData__sortables">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 512">
                                                        <path d="M280 64l40 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l40 0 9.6 0C121 27.5 153.3 0 192 0s71 27.5 78.4 64l9.6 0zM64 112c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16l-16 0 0 24c0 13.3-10.7 24-24 24l-88 0-88 0c-13.3 0-24-10.7-24-24l0-24-16 0zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" style="fill: currentColor;"></path>
                                                    </svg>
                                                </button>
                                            `
                                            dimanNewButton__sortable.innerHTML = `
                                                <button class="dimanButton__telegram__copy__button copyOrderData__sortables">
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 100%;">
                                                    <path d="M17.0943 7.14643C17.6874 6.93123 17.9818 6.85378 18.1449 6.82608C18.1461 6.87823 18.1449 6.92051 18.1422 6.94825C17.9096 9.39217 16.8906 15.4048 16.3672 18.2026C16.2447 18.8578 16.1507 19.1697 15.5179 18.798C15.1014 18.5532 14.7245 18.2452 14.3207 17.9805C12.9961 17.1121 11.1 15.8189 11.2557 15.8967C9.95162 15.0373 10.4975 14.5111 11.2255 13.8093C11.3434 13.6957 11.466 13.5775 11.5863 13.4525C11.64 13.3967 11.9027 13.1524 12.2731 12.8081C13.4612 11.7035 15.7571 9.56903 15.8151 9.32202C15.8246 9.2815 15.8334 9.13045 15.7436 9.05068C15.6539 8.97092 15.5215 8.9982 15.4259 9.01989C15.2904 9.05064 13.1326 10.4769 8.95243 13.2986C8.33994 13.7192 7.78517 13.9242 7.28811 13.9134L7.29256 13.9156C6.63781 13.6847 5.9849 13.4859 5.32855 13.286C4.89736 13.1546 4.46469 13.0228 4.02904 12.8812C3.92249 12.8466 3.81853 12.8137 3.72083 12.783C8.24781 10.8109 11.263 9.51243 12.7739 8.884C14.9684 7.97124 16.2701 7.44551 17.0943 7.14643ZM19.5169 5.21806C19.2635 5.01244 18.985 4.91807 18.7915 4.87185C18.5917 4.82412 18.4018 4.80876 18.2578 4.8113C17.7814 4.81969 17.2697 4.95518 16.4121 5.26637C15.5373 5.58382 14.193 6.12763 12.0058 7.03736C10.4638 7.67874 7.39388 9.00115 2.80365 11.001C2.40046 11.1622 2.03086 11.3451 1.73884 11.5619C1.46919 11.7622 1.09173 12.1205 1.02268 12.6714C0.970519 13.0874 1.09182 13.4714 1.33782 13.7738C1.55198 14.037 1.82635 14.1969 2.03529 14.2981C2.34545 14.4483 2.76276 14.5791 3.12952 14.6941C3.70264 14.8737 4.27444 15.0572 4.84879 15.233C6.62691 15.7773 8.09066 16.2253 9.7012 17.2866C10.8825 18.0651 12.041 18.8775 13.2243 19.6531C13.6559 19.936 14.0593 20.2607 14.5049 20.5224C14.9916 20.8084 15.6104 21.0692 16.3636 20.9998C17.5019 20.8951 18.0941 19.8479 18.3331 18.5703C18.8552 15.7796 19.8909 9.68351 20.1332 7.13774C20.1648 6.80544 20.1278 6.433 20.097 6.25318C20.0653 6.068 19.9684 5.58448 19.5169 5.21806Z"></path>
                                                </svg>
                                                </button>
                                            `
                
                                            const extraInfoValue__linkOrder = document.querySelector("#extraOrderNameData .extraInfoValue__link")
                                            const extraInfoValue__linkSortable = document.querySelector("#extraOrderSortableData .extraInfoValue__link")
                
                                            extraInfoValue__linkOrder.href = `https://logistics.market.yandex.ru/sorting-center/21972131/orders/${diman__currentOrder}`
                                            extraInfoValue__linkOrder.innerText = `${diman__currentOrder}`
                                            extraInfoValue__linkSortable.href = `https://logistics.market.yandex.ru/sorting-center/21972131/orders/${diman__currentSortable}`
                                            extraInfoValue__linkSortable.innerText = `${diman__currentSortable}`
                
                                            function addCopyListenersToSortables() {
                                                const copyOrderData__sortables = document.querySelectorAll(".copyOrderData__sortables");
                                            
                                                copyOrderData__sortables.forEach((item) => {
                                                    if (item.dataset.listenerAttached) return;
                                                    item.dataset.listenerAttached = "true";
                                            
                                                    item.addEventListener('click', () => {
                                                        let textCopy__sortables;
                                            
                                                        if (item.classList.contains("dimanButton__default__copy__button")) {
                                                            textCopy__sortables = `${diman__currentOrder} (${diman__currentSortable})`;
                                                        } else if (item.classList.contains("dimanButton__telegram__copy__button")) {
                                                            textCopy__sortables = `\`${diman__currentOrder}\` (\`${diman__currentSortable}\`)`;
                                                        }
                                            
                                                        if (textCopy__sortables) {
                                                            navigator.clipboard.writeText(textCopy__sortables)
                                                                .then(() => {
                                                                    console.log(`Copied: ${textCopy__sortables}`);
                                                                    tpiNotification.show("Текст скопирован", "success", `Текст <span>${textCopy__sortables}</span> успешно скопирован`);
                                                                })
                                                                .catch(err => {
                                                                    console.error('Failed to copy text: ', err);
                                                                    tpiNotification.show("Текст скопирован", "error", err);
                                                                });
                                                        }
                                                    });
                                                });
                                            }
                
                                            addCopyListenersToSortables();
                
                                            const observer = new MutationObserver((mutationsList) => {
                                                for (const mutation of mutationsList) {
                                                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                                        addCopyListenersToSortables();
                                                    }
                                                }
                                            });
                
                                            observer.observe(document.body, {
                                                childList: true,
                                                subtree: true
                                            });
                                        }
                                        
                            
                                    }
                                } catch (e) {
                                    // Игнорируем ошибки внутри интервала
                                }
                            }, 500);
                
                            setTimeout(() => clearInterval(intervalId), 10000);
                        } catch (e) {
                            retryCount++;
                            console.warn(`Ошибка при обработке iframe. Попытка ${retryCount} из ${maxRetries}`, e);
                            iframe.remove();
                
                            if (retryCount < maxRetries) {
                                setTimeout(createIframe, 1000);
                            } else {
                                return;
                            }
                        }
                    };
                
                    iframe.onerror = () => {
                        retryCount++;
                        console.warn(`Ошибка загрузки iframe. Попытка ${retryCount} из ${maxRetries}`);
                        iframe.remove();
                
                        if (retryCount < maxRetries) {
                            setTimeout(createIframe, 1000);
                        } else {
                            return;
                        }
                    };
                }
                
                createIframe();
                addPotovarkaInfo()
                insertScanLogButton()
                scanLogAutoPreload()
                scanLogCheckLoadSettings()
            }
        });
    });
}

let checkFOS__setup__found = false
function checkFOS__setup() {
    if (document.querySelector("iframe.diman-search__fos")) {
        return;
    }

    let attempts = 0;
    const maxAttempts = 5;

    const intervalId = setInterval(() => {
        attempts++;
        let sortable = null;

        document.querySelectorAll("div").forEach((div) => {
            const text = div.textContent.trim();
            const match = text.match(/^Грузоместо № (.+)$/i);
            if (match) sortable = match[1].trim();
        });

        if (sortable) {
            clearInterval(intervalId);

            if (document.querySelector("iframe.diman-search__fos") && checkFOS__setup__found == true) {
                return;
            }

            // ⬇ СОЗДАЁМ iframe ТОЛЬКО ПОСЛЕ НАХОЖДЕНИЯ sortable
            if(checkFOS__setup__found == false){

                const iframeFos = document.createElement("iframe");
                iframeFos.classList.add("diman-search__fos");
                iframeFos.style.position = "absolute";
                iframeFos.style.left = "-10px";
                iframeFos.style.top = "-10px";
                iframeFos.style.zIndex = "-9999999";
                iframeFos.style.width = "1px";
                iframeFos.style.height = "1px";
                iframeFos.setAttribute("sandbox", "allow-scripts allow-same-origin");
    
                iframeFos.src = `https://logistics.market.yandex.ru/sorting-center/21972131/sc-support?query=${sortable}`;
                document.body.prepend(iframeFos);
                checkFOS__setup__found = true
    
                iframeFos.onload = () => {
                    console.log("🟣[fos-traker] iframe загружен");
    
                    let attempts = 0;
                    const maxAttempts = 6;
    
                    const dataInterval = setInterval(() => {
                        attempts++;
    
                        try {
                            const doc = iframeFos.contentDocument || iframeFos.contentWindow.document;
                            if (!doc) {
                                if (attempts >= maxAttempts) clearInterval(dataInterval);
                                return;
                            }
    
                            const allTbodies = doc.querySelectorAll("tbody");
                            if (!allTbodies.length && attempts >= maxAttempts) {
                                console.warn("🟣[fos-traker] Нет таблиц, остановка.");
                                clearInterval(dataInterval);
                                return;
                            }
    
                            for (const tbody of allTbodies) {
                                const rows = Array.from(tbody.querySelectorAll("tr"));
                                if (rows.length === 0) continue;
    
                                const emptyRow = rows.find(tr => {
                                    const span = tr.querySelector("td > span");
                                    const text = span?.textContent.trim() || "";
                                    const tdCount = tr.querySelectorAll("td").length;
                                    return (text === "Обращения не найдены" || text === "Обращения отсутствуют") && tdCount <= 2;
                                });
    
                                if (emptyRow && rows.length === 1) {
                                    console.log("🟣[fos-traker] Обращений нет ❌");
                                    clearInterval(dataInterval);
                                    return;
                                }
    
                                const validRows = rows.filter(tr => tr.querySelectorAll("td").length >= 7);
                                if (!validRows.length) continue;
    
                                console.log("🟣[fos-traker] Найдено обращений:", validRows.length);
                                checkFOS__setup__found = true
    
                                const appeals = validRows.map(row => {
                                    const cells = row.querySelectorAll("td");
                                    const aTag = cells[0]?.querySelector("a");
    
                                    return {
                                        address: aTag?.textContent.trim() || "",
                                        href: aTag?.href || "",
                                        theme: cells[1]?.querySelector("span")?.textContent.trim() || "",
                                        task: cells[2]?.querySelector("span")?.textContent.trim() || "",
                                        status: cells[3]?.querySelector("span")?.textContent.trim() || "",
                                        author: cells[4]?.querySelector("span")?.textContent.trim() || "",
                                        updatedAt: cells[5]?.querySelector("span")?.textContent.trim() || "",
                                        createdAt: cells[6]?.querySelector("span")?.textContent.trim() || "",
                                    };
                                });
    
                                createFos__section(appeals); // ТВОЯ ФУНКЦИЯ
                                clearInterval(dataInterval);
                                return;
                            }
    
                            if (attempts >= maxAttempts) {
                                console.log("🟣[fos-traker] Таймаут ожидания обращений в iframe");
                                clearInterval(dataInterval);
                            }
    
                        } catch (e) {
                            console.log("🟣[fos-traker] Ошибка чтения из iframe:", e);
                            if (attempts >= maxAttempts) clearInterval(dataInterval);
                        }
                    }, 2000);
                };
            }

        } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
        } else if (attempts <= maxAttempts && checkFOS__setup__found == false && document.querySelector(".diman-search__fos")) {
            console.log(`🟣[fos-traker] Попытка ${attempts}/${maxAttempts} — грузоместо не найдено`);
        } else return
    }, 200);
}


function createFos__section(appeals) {
    if (!Array.isArray(appeals) || appeals.length === 0) {
        // Нет обращений — ничего не создаём
        return;
    }

    const parentContainer = document.querySelector('.diman__InfoPretier');
    if (!parentContainer) {
        console.warn('🟣[fos-traker] Контейнер .diman__InfoPretier не найден, вставка невозможна');
        return;
    }

    // Ищем или создаём div для вывода обращений
    let infoDiv = parentContainer.querySelector('.diman__fosTraker__info');
    let fos__infoBox = parentContainer.querySelector('.fos__infoBox');
    if (!infoDiv) {
        infoDiv = document.createElement('div');
        infoDiv.classList.add('diman__fosTraker__info');
        infoDiv.innerHTML = `
            <div class="diman__fos-traker-title">Созданные обращения</div>
            <div class="fos__infoBox temp_fos-loading">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
                        <stop offset="0" stop-color="#2B2B2B"></stop>
                        <stop offset=".3" stop-color="#2B2B2B" stop-opacity=".9"></stop>
                        <stop offset=".6" stop-color="#2B2B2B" stop-opacity=".6"></stop>
                        <stop offset=".8" stop-color="#2B2B2B" stop-opacity=".3"></stop>
                        <stop offset="1" stop-color="#2B2B2B" stop-opacity="0"></stop>
                    </radialGradient>
                    <circle transform-origin="center" fill="none" stroke="url(#a12)" stroke-width="17" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70">
                        <animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform>
                    </circle>
                    <circle transform-origin="center" fill="none" opacity=".2" stroke="#2B2B2B" stroke-width="17" stroke-linecap="round" cx="100" cy="100" r="70"></circle>
                </svg>
            </div>
        `;
        parentContainer.appendChild(infoDiv);
    }
    
    fos__infoBox.classList.remove("temp_fos-loading")
    fos__infoBox.innerHTML = ""

    appeals.forEach((appeal, index) => {
        const fos_container = document.createElement('div');
        fos_container.classList.add('diman__fos-traker-container');

        fos_container.innerHTML = `
                <div class="fos_infoBlock">
                    <div class="fos_infoTitle">Обращение</div>
                    <div class="fos_infoData">#${index + 1}</div>
                </div>
                <div class="fos_infoBlock">
                    <div class="fos_infoTitle">Номер обращения</div>
                    <a href="${appeal.href}" class="fos_infoData">${appeal.address}</a>
                </div>
                <div class="fos_infoBlock">
                    <div class="fos_infoTitle">Тема</div>
                    <div class="fos_infoData">${appeal.theme}</div>
                </div>
                <div class="fos_infoBlock">
                    <div class="fos_infoTitle">Краткое описание проблемы</div>
                    <div class="fos_infoData">${appeal.task}</div>
                </div>
                <div class="fos_infoBlock">
                    <div class="fos_infoTitle">Статус</div>
                    <div class="fos_infoData">${appeal.status}</div>
                </div>
                <div class="fos_infoBlock">
                    <div class="fos_infoTitle">Автор</div>
                    <div class="fos_infoData">${appeal.author}</div>
                </div>
                <div class="fos_infoBlock">
                    <div class="fos_infoTitle">Обновлено</div>
                    <div class="fos_infoData">${appeal.updatedAt}</div>
                </div>
                <div class="fos_infoBlock">
                    <div class="fos_infoTitle">Создано</div>
                    <div class="fos_infoData">${appeal.createdAt}</div>
                </div>
        `;

        fos__infoBox.appendChild(fos_container);
    });
}

//D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D 
//D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D 
//D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D 
//D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D 
//D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D 
//D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D 
//D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D 
//D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D-D
function addPotovarkaInfo(){
    const isCrossPotovarka = document.getElementById("extraOrderСrossData")
    if(isCrossPotovarka){
        const isCrossPotovarka__value = document.querySelector("#extraOrderСrossData .extraInfoValue__link")
        if(isCrossPotovarka__value){
            checkTrsByLinkAndStages()
        }
    }
}

function checkTrsByLinkAndStages() {
    const selector = 'a[data-tid="8e34e3c2 d47a3f9b 2cf94f05 422bcbe4"]';
    const allLinks = Array.from(document.querySelectorAll(selector));
    const isCrossPotovarka__value = document.querySelector("#extraOrderСrossData .extraInfoValue__link")
    
    if (allLinks.length === 0) {
        isCrossPotovarka__value.setAttribute("isCrossPotovarka", false)
        isCrossPotovarka__value.innerHTML = "Нет"
      return;
    }
  
    const trGroupsByHref = {};
  
    allLinks.forEach(a => {
      const tr = a.closest('tr');
      const href = a.href?.trim();
      if (tr && href) {
        if (!trGroupsByHref[href]) {
          trGroupsByHref[href] = [];
        }
        trGroupsByHref[href].push(tr);
      }
    });
  
    for (const trs of Object.values(trGroupsByHref)) {
      if (trs.length < 2) continue;
  
      const firstTr = trs[0];
      const lastTr = trs[trs.length - 1];
  
      const shippedInFirst = firstTr.querySelector('[data-e2e-i18n-key="common.sorting-center:stage-SHIPPED_DIRECT"]');
      const awaitingInLast = lastTr.querySelector('[data-e2e-i18n-key="common.sorting-center:stage-AWAITING_DIRECT"]');
  
      if (shippedInFirst && awaitingInLast) {
        isCrossPotovarka__value.setAttribute("isCrossPotovarka", true)
        isCrossPotovarka__value.innerHTML = "Да"
        return;
      }
    }
    isCrossPotovarka__value.setAttribute("isCrossPotovarka", false)
    isCrossPotovarka__value.innerHTML = "Нет"
}

addPotovarkaInfo()

function addClosingGap() {
    setTimeout(() => {
        const maxAttempts = 3; 
        const interval = 500; 
        let attempts = 0;

        function tryAdd() {
            const infoPretier = document.querySelector(".diman__InfoPretier");
            const infoPretierDivs = infoPretier ? infoPretier.querySelectorAll("div") : null;
            const infoPretierHasGap = document.querySelector(".diman__closingGap");

            if (infoPretier && infoPretierDivs && infoPretierDivs.length >= 4 && !infoPretierHasGap) {

                const dimanClosingGap = document.createElement("div");
                dimanClosingGap.classList.add("diman__closingGap");
                infoPretier.appendChild(dimanClosingGap);
            } else if (attempts < maxAttempts) {

                attempts++;
                setTimeout(tryAdd, interval);
            } else {
                return
            }
        }

        tryAdd();
    }, 1000);
}

function runSafeUpdateSpanClassesInSortable() {
    if (window.__dimanUpdateSortableLock) return;
    window.__dimanUpdateSortableLock = true;

    requestIdleCallback(() => {
        try {
            updateSpanClassesInSortable();
        } catch (e) {
            console.error("Ошибка в updateSpanClassesInSortable:", e);
        } finally {
            window.__dimanUpdateSortableLock = false;
        }
    }, { timeout: 2000 });
}

function runSafeUpdateSpanClasses() {
    if (window.__dimanUpdateLock) return;
    window.__dimanUpdateLock = true;

    requestIdleCallback(() => {
        try {
            updateSpanClasses();
        } catch (e) {
            console.error("Ошибка в updateSpanClasses:", e);
        } finally {
            window.__dimanUpdateLock = false;
        }
    }, { timeout: 2000 }); // fallback если не дождались idle
}

function inboundsHighlight() {
    const currentUrl = window.location.href;
    const baseUrl = "https://logistics.market.yandex.ru/sorting-center/21972131/inbounds";
  
    if (!currentUrl.startsWith(baseUrl)) return;
  
    const rows = document.querySelectorAll("tr");
  
    rows.forEach(row => {
      const td = row.querySelector("td:nth-child(3)");
      if (!td) return;
  
      const link = td.querySelector("div a");
      if (!link) return;
  
      const text = link.textContent.trim();
      const match = text.match(/^(\d+)\s*\/\s*(\d+)$/);
  
      if (match) {
        const left = parseInt(match[1], 10);
        const right = parseInt(match[2], 10);
  
        if (left !== right) {
          row.classList.add("diman_inboundsDiffernece");
          row.classList.remove("diman_inbounds");
        } else {
          row.classList.add("diman_inbounds");
          row.classList.remove("diman_inboundsDiffernece");
        }
      }
    });
}


//A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-    
//A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-    
//A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-    
//A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-    
//A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-    
//A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-    
//A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-    
//A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-A-    
function callTurboPI__once(){
    if(notMutation == true){
        console.log("🧠 callTurboPI__once() — called");
        notMutation = false
        setTimeout(() => {
                addTurboPiTitle()
                updateTimeElements();
                checkAndApplyClassToRows();
                setIconsToSortableStatus();
                runSafeUpdateSpanClasses();
                runSafeUpdateSpanClassesInSortable();    
                updateSpanClassesInCells()
                highlightLinks();
                addCopyButton();
                changeSortablesLayout()
                addClosingGap()
                addPotovarkaInfo()
                sortableInfo__extraInfo()
                inboundsHighlight()
                missedShipping()
                searchSortablesScanlog()
                processHeaders()
                // checkFOS__setup()
                handleScanlogLoading()
                addToastContainer()
                predBrak()
                // setTimeout(() => {
                //     processHeaders()
                //     checkFOS__setup()
                // }, 2000);
                // tpiNotification.showWarning("TURBOpi", "Расширение успешно внедренно");
                tpiNotification.showtpiInject("TURBOpi", "Успешено интегрирован🎉");
        }, 1000);
        setTimeout(() => {
            addTurboPiTitle()
        }, 5000);
    }else return
}

function callTurboPI__mutation(){
   console.log("🧠 callTurboPI__mutation() — called");
   setTimeout(() => {
    
        addTurboPiTitle()
        runSafeUpdateSpanClasses();
        runSafeUpdateSpanClassesInSortable();    
        updateSpanClassesInCells()
        addCopyButton()
        setIconsToSortableStatus()
        addToastContainer()
        fixOutboundsNames()
   }, 10);
}


function observeTbodyChanges() {
    const tbody = document.querySelector('tbody');

    if (!tbody) {
        return;
    }

    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'subtree') {
                    callTurboPI__once()
                    callTurboPI__mutation()
            }
        }
    });

    // Настройки наблюдателя
    observer.observe(tbody, { childList: true, subtree: true });
}

// Запуск наблюдателя
observeTbodyChanges();

//TODO

const helpLink = document.querySelector('.p-layout__help');

function changeSupportWithRefresh(){
    if (helpLink) {
        const refreshButton = document.createElement('button');
    
        refreshButton.className = 'dimanRefresh';
        helpLink.replaceWith(refreshButton);
    }
}

changeSupportWithRefresh();
setInterval(() => {
    changeSupportWithRefresh()
    if(!helpLink){
        clearInterval();
    }
}, 5000);



const dimanRefreshButton = document.querySelector('.dimanRefresh')
if(dimanRefreshButton ){
    dimanRefreshButton.addEventListener('click', ()=>{
        callTurboPI__once()
    })
}