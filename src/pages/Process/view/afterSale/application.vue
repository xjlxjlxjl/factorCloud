<template>
  <div id="application">
    <applyService :active="active" @refresh="refreshed"></applyService>
    <delegateUser :active="active" title="选择委派人员" @refresh="refreshed"></delegateUser>
    <createdReport :active="active" @refresh="childRefreshed"></createdReport>
    <div
      class="modal fade bs-example-modal-lg"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div id="afterSaleChildToolbar">
            <span class="lead">报告列表</span>
            <el-button @click="addReport" size="small">上传报告</el-button>
          </div>
          <table id="afterSaleChildTable"></table>
        </div>
      </div>
    </div>
    <div id="afterSaleToolbar">
      <span class="lead">客服申请表</span>
    </div>
    <table id="afterSaleTable"></table>
  </div>
</template>
<script>
import applyService from "@/pages/Process/common/applyService";
import delegateUser from "@/pages/Process/common/delegateUser";
import createdReport from "@/pages/Process/common/createdReport";

export default {
  name: "application",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      active: {},
      tableData: []
    };
  },
  components: {
    applyService: applyService,
    delegateUser: delegateUser,
    createdReport: createdReport
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("service/list", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.tableData = response.data.list;
          that.$store.commit("changeTasks", {
            name: "application",
            num: response.data.pagination.total
          });
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        search: params.search,
        // is_reported: 0,
        service_status: 0
      };
    },
    childAjaxData(params) {
      let that = this;
      if (!this.active.id) {
        params.success({
          rows: [],
          total: 0
        });
        return false;
      }
      that
        .$get(`service/report`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => {});
    },
    childAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        number: this.active.service_number
      };
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "service_number",
            title: "客服申请单号",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建日期",
            sortable: true
          },
          {
            field: "business_man_name",
            title: "申请联系人",
            editable: {
              type: "text",
              title: "申请联系人",
              emptytext: "空"
            }
          },
          {
            field: "customer_demand",
            title: "问题描述",
            editable: {
              type: "text",
              title: "问题描述",
              emptytext: "空"
            }
          },
          {
            field: "customer_linkman",
            title: "客户联系人",
            editable: {
              type: "text",
              title: "客户名",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "customer_contact",
            title: "客户联系方式",
            sortable: true,
            editable: {
              type: "text",
              title: "联系方式",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "customer_other_contact",
            title: "客户其他联系方式",
            sortable: true,
            editable: {
              type: "text",
              title: "客户其他联系方式",
              emptytext: "无",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "specification",
            title: "规格",
            sortable: true,
            editable: {
              type: "text",
              title: "规格",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "process_name",
            title: "订单处理状态"
          },
          {
            field: "deal_mans",
            title: "委派人员",
            sortable: true,
            formatter: (value, row, index) => {
              return row.deal_mans.join(",");
            }
          },
          {
            field: "price",
            title: "维修报价",
            formatter: (value, row, index) => {
              return `${value || "未报价"}`;
            }
          },
          {
            field: "discount_price",
            title: "折扣价",
            formatter: (value, row, index) => {
              return `${value || "未报价"}`;
            }
          },
          {
            field: "yingshou",
            title: "应收价",
            formatter: (value, row, index) => {
              return `${row.price ? row.price - row.discount_price : "未报价"}`;
            }
          },
          {
            field: "service_status_name",
            title: "服务状态"
          },
          {
            field: "remark",
            title: "备注",
            editable: {
              type: "text",
              title: "备注",
              emptytext: "空"
            }
          },
          {
            field: "id",
            title: "",
            formatter: (value, row, index) => {
              let del = [
                '<button class="btn btn-danger del btn-sm">　删除　</button>'
              ];
              let apply = [
                '<button class="btn btn-primary apply btn-sm">　报价　</button>'
              ];
              let delegate = [
                '<button class="btn btn-warning delegate btn-sm">委派人员</button>'
              ];
              let report = [
                '<button class="btn btn-warning report btn-sm">新建报告</button>'
              ];

              switch (row.process) {
                case 2:
                  if (!row.deal_mans.length) return del + delegate;
                  else if (row.quoted_price.price == undefined)
                    return report + del + apply + delegate;
                  else if (
                    row.quoted_price.price != undefined &&
                    row.deal_mans.length &&
                    !row.deal_result
                  )
                    return report + del + apply + delegate;
                  else return del;
                default:
                  return del;
                  break;
              }
            },
            events: {
              "click .del": ($el, value, row, index) => {
                that
                  .$post(`/service/delete/${value}`)
                  .then(response => {
                    that.delTable($("#afterSaleTable"), "id", [value]);
                  })
                  .catch(err => {});
              },
              "click .apply": ($el, value, row, index) => {
                that.active = row;
                applyService.methods.close.call(this);
              },
              "click .delegate": ($el, value, row, index) => {
                that.active = row;
                delegateUser.methods.close.call(this);
              },
              "click .report": ($el, value, row, index) => {
                that.active = row;
                that.refresh($("#application #afterSaleChildTable"));
                $(".bs-example-modal-lg").modal("show");
              }
            }
          }
        ],
        data = {
          toolbar: "#afterSaleToolbar",
          ajax: this.tableAjaxData,
          queryParams: this.tableAjaxParams,
          search: true,
          strictSearch: true,
          showRefresh: true,
          sidePagination: "server",
          pagination: true,
          striped: true,
          clickToSelect: true,
          showColumns: true,
          sortName: "createTime",
          sortOrder: "desc",
          idField: "id",
          showToggle: true,
          showExport: true,
          exportDataType: "all",
          exportTypes: ["csv", "txt", "sql", "doc", "excel", "xlsx", "pdf"],
          classes: "table",
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: columns,
          onEditableSave(field, mrow, oldValue, $el) {
            that
              .$post(`/service/edit/${mrow.id}`, mrow)
              .then(response => {
                if (response.status != 200) return false;
                this.refreshed();
              })
              .catch(err => {});
          },
          detailFormatter(field, mrow, oldValue, $el) {
            let html = [];
            if (mrow.customer_files.length) {
              html.push(
                `<p class="lead" align="left">客户上传文件</p><ul class="list-inline" align="left">`
              );
              mrow.customer_files.forEach(e => {
                let ess = e.url.split(".").pop();
                switch (ess) {
                  case "jpg":
                  case "png":
                  case "jpeg":
                    html.push(
                      `<li><a href="${e.url}" target="_blank"><img src="${
                        e.url
                      }" class="img-rounded" style="width: 100px;"></a></li>`
                    );
                    break;
                  default:
                    html.push(
                      `<li><a href="${e.url}" target="_blank">${e.url
                        .split("/")
                        .pop()}</a></li>`
                    );
                    break;
                }
              });
              html.push(`</ul>`);
            }
            if (mrow.business_files.length) {
              html.push(
                `<p class="lead" align="left">业务上传文件</p><ul class="list-inline" align="left">`
              );
              mrow.business_files.forEach(e => {
                let ess = e.url.split(".").pop();
                switch (ess) {
                  case "jpg":
                  case "png":
                  case "jpeg":
                    html.push(
                      `<li><a href="${e.url}" target="_blank"><img src="${
                        e.url
                      }" class="img-rounded" style="width: 100px;"></a></li>`
                    );
                    break;
                  default:
                    html.push(
                      `<li><a href="${e.url}" target="_blank">${e.url
                        .split("/")
                        .pop()}</a></li>`
                    );
                    break;
                }
              });
              html.push(`</ul>`);
            }
            if (mrow.service_files.length) {
              html.push(
                `<p class="lead" align="left">客服上传文件</p><ul class="list-inline" align="left">`
              );
              mrow.service_files.forEach(e => {
                let ess = e.url.split(".").pop();
                switch (ess) {
                  case "jpg":
                  case "png":
                  case "jpeg":
                    html.push(
                      `<li><a href="${e.url}" target="_blank"><img src="${
                        e.url
                      }" class="img-rounded" style="width: 100px;"></a></li>`
                    );
                    break;
                  default:
                    html.push(
                      `<li><a href="${e.url}" target="_blank">${e.url
                        .split("/")
                        .pop()}</a></li>`
                    );
                    break;
                }
              });
              html.push(`</ul>`);
            }
            return html.join("");
          }
        },
        childColumns = [
          {
            checkbox: true
          },
          {
            field: "number",
            title: "客服报告单号",
            sortable: true
          },
          {
            field: "customer_name",
            title: "客户名称",
            sortable: true
          },
          {
            field: "customer_linkman",
            title: "联系人",
            sortable: true
          },
          {
            field: "customer_mobile",
            title: "客户手机",
            sortable: true
          },
          {
            field: "specification",
            title: "规格",
            sortable: true
          },
          {
            field: "quantity",
            title: "数量",
            sortable: true
          },
          {
            field: "description",
            title: "描述",
            sortable: true
          },
          {
            field: "analysis",
            title: "原因分析",
            sortable: true
          },
          {
            field: "content",
            title: "处理方案",
            sortable: true
          },
          {
            field: "organization",
            title: "责任单位",
            sortable: true
          },
          {
            field: "advice",
            title: "维修建议",
            sortable: true
          },
          {
            field: "service_at",
            title: "服务时间",
            sortable: true
          },
          {
            field: "member_name",
            title: "创建人",
            sortable: true
          },
          {
            field: "company_name",
            title: "创建人公司",
            sortable: true
          }
        ],
        childData = {
          toolbar: "#afterSaleChildToolbar",
          ajax: this.childAjaxData,
          queryParams: this.childAjaxParams,
          search: false,
          strictSearch: true,
          showRefresh: true,
          sidePagination: "server",
          pagination: true,
          striped: true,
          clickToSelect: true,
          showColumns: true,
          idField: "id",
          showToggle: true,
          showExport: true,
          exportDataType: "all",
          exportTypes: ["csv", "txt", "sql", "doc", "excel", "xlsx", "pdf"],
          classes: "table",
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: childColumns,
          onEditableSave(field, mrow, oldValue, $el) {},
          detailFormatter(field, mrow, oldValue, $el) {
            let content = [`<table><tr>`];
            mrow.files.forEach(e =>
              content.push(
                `<td><img src="${e.url}" style="width: 150px;" /></td>`
              )
            );
            content.push(`</tr></table>`);
            return content.join("");
          }
        };
      $("#application #afterSaleTable").bootstrapTable(data);
      $("#application #afterSaleChildTable").bootstrapTable(childData);
    },
    addReport() {
      $(".bs-example-modal-lg").modal("hide");
      createdReport.methods.close.call(this);
    },
    refreshed() {
      this.refresh($("#afterSaleTable"));
    },
    childRefreshed() {
      $(".bs-example-modal-lg").modal("show");
      this.refresh($("#afterSaleChildTable"));
    }
  },
  mounted() {
    this.init();
  },
  created() {}
};
</script>
<style lang="less">
#application {
}
</style>
