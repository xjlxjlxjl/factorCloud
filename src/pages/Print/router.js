import Vue from "vue";
import Router from "vue-router";

import purchaseApply from '@/pages/Print/view/purchaseApply';
import purchasePlan from '@/pages/Print/view/purchasePlan';
import purchaseOrder from '@/pages/Print/view/purchaseOrder';
import purchasEntrust from '@/pages/Print/view/purchasEntrust';
import purchasReceive from '@/pages/Print/view/purchasReceive';
import saleOrder from '@/pages/Print/view/saleOrder';
import IQCtemporary from '@/pages/Print/view/IQCtemporary';
import IQCunhealthy from '@/pages/Print/view/IQCunhealthy';
import saleNonstandard from '@/pages/Print/view/saleNonstandard';
Vue.use(Router);


export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/purchaseApply/:id",
      name: "purchaseApply",
      component: purchaseApply
    }, {
      path: "/purchasePlan/:id",
      name: "purchasePlan",
      component: purchasePlan
    }, {
      path: "/purchaseOrder/:id",
      name: "purchaseOrder",
      component: purchaseOrder
    }, {
      path: "/purchasEntrust/:id",
      name: "purchasEntrust",
      component: purchasEntrust
    }, {
      path: "/purchasReceive/:id",
      name: "purchasReceive",
      component: purchasReceive
    }, {
      path: "/saleOrder/:id",
      name: "saleOrder",
      component: saleOrder
    }, {
      path: "/IQCtemporary/:id",
      name: "IQCtemporary",
      component: IQCtemporary
    }, {
      path: "/IQCunhealthy/:id",
      name: "IQCunhealthy",
      component: IQCunhealthy
    }, {
      path: "/saleNonstandard/:id",
      name: "saleNonstandard",
      component: saleNonstandard
    }
  ]
})
