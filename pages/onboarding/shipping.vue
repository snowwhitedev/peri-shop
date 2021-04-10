<template>
  <div class="h-screen flex overflow-hidden bg-gray-100">
    <Sidenav />
    <div class="flex flex-col w-0 flex-1 overflow-hidden border border-r-0 border-t-0 border-b-0">
      <main
        class="flex-1 relative z-0 overflow-y-auto focus:outline-none mt-12 lg:mt-0"
        tabindex="0"
      >
        <div class="pt-2 pb-6 md:py-6">
          <div class="flex flex-col col-gap-4" :class="showShippingForm ? 'hidden' : 'block'">
            <div class="w-full mt-5 p-8">
              <div class="w-full border border-t-0 border-l-0 border-r-0">
                <span
                  class="w-full flex flex-col items-center text-gray-800 font-semibold text-2xl mb-3"
                >Available shipping options</span>
              </div>

              <div class="overflow-x-auto inline-block w-full shadow rounded-lg">
                <Paginator
                  :maxVisibleButtons="3"
                  :currentPage="current_page"
                  :totalPages="Math.ceil(shippingData.length/limit)"
                  :total="shippingData.length"
                  @pageChanged="refetchShipping"
                />
                <table class="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        S/N
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        Active
                      </th>
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      />
                      <th
                        class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      />
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(shippingItem, index) in shipping" :key="index">
                      <td
                        class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ current_page === 1 ? index+1 : (limit*(current_page-1))+index+1 }}.
                      </td>
                      <td
                        class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        ${{ shippingItem.price }}
                      </td>
                      <td
                        class="px-1 py-1 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        {{ shippingItem.description }}
                      </td>
                      <td
                        class="px-4 py-2 border-b border-gray-200 bg-white text-sm"
                        :class="index%2 === 0 ? '' : 'bg-gray-100'"
                      >
                        <button v-if="shippingItem.is_active" disabled class="rounded-full cursor-text text-green-500 py-1 px-2 border border-green-500 bg-transparent text-sm leading-5 font-medium">
                          active
                        </button>
                        <button v-else disabled class="rounded-full cursor-text text-gray-600 py-1 px-2 border border-gray-400 bg-transparent bg-gray-200 text-sm leading-5 font-medium">
                          inactive
                        </button>
                      </td>
                      <td class="py-1 px-1 border-b border-gray-200 bg-white text-sm">
                        <div class="flex flex-row">
                          <button
                            class="py-2 px-4 mr-1 border border-transparent text-sm leading-5 font-medium rounded text-green-500 bg-green-100 hover:border-green-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                            @click="openModal(shippingItem)"
                          >
                            <font-awesome-icon :icon="['fa', 'edit']" />
                          </button>
                          <button
                            class="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded text-red-500 bg-red-100 hover:border-red-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                            @click="deactivateShipping(shippingItem.store_shipping_id)"
                          >
                            <font-awesome-icon :icon="['fa', 'trash']" />
                          </button>
                        </div>
                      </td>
                      <td class="py-1 px-1 border-b border-gray-200 bg-white text-sm">
                        <div class="flex flex-row">
                          <button
                            class="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded text-gray-700 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                            @click="toggleDropDown(shippingItem.store_shipping_id)"
                          >
                            <font-awesome-icon :icon="['fa', 'ellipsis-v']" />
                          </button>
                        </div>
                        <div :class="dropDownStateId === shippingItem.store_shipping_id ? 'block' : 'hidden'">
                          <button
                            type="button"
                            class="hidden sm:block sm:fixed sm:opacity-0 sm:inset-0 sm:w-full sm:h-full sm:cursor-default"
                            @click="toggleDropDown(shippingItem.store_shipping_id)"
                          />
                          <div
                            class="z-50 sm:mt-2 sm:absolute sm:bg-white sm:rounded sm:right-0 sm:shadow-xl sm:w-48 sm:py-2"
                          >
                            <span
                              class="py-3 block cursor-pointer text-gray-400 hover:text-white sm:text-sm sm:text-gray-800 sm:px-4 sm:py-2 sm:hover:bg-red-700"
                              @click="moveItemTo('top', shippingItem.store_shipping_id)"
                            >
                              Move to top
                            </span>
                            <span
                              class="py-3 block cursor-pointer text-gray-400 hover:text-white sm:text-sm sm:text-gray-800 sm:px-4 sm:py-2 sm:hover:bg-red-700"
                              @click="moveItemTo('bottom', shippingItem.store_shipping_id)"
                            >
                              Move to bottom
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Modal -->
                <b-modal
                  :active.sync="makeModal"
                  has-modal-card
                  trap-focus
                  :destroy-on-hide="false"
                  aria-role="dialog"
                  aria-modal
                >
                  <div>
                    <div
                      class="flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 modal-card"
                    >
                      <div class="max-w-md w-full modal-card-body bg-gray-100">
                        <div>
                          <h2
                            class="mt-3 text-center text-3xl leading-9 font-extrabold text-gray-900"
                          >
                            Edit Shipping option
                          </h2>
                        </div>
                        <form class="mt-8" action="#" method="POST">
                          <input type="hidden" name="remember" value="true">
                          <div class="rounded-md shadow-sm">
                            <div class="grid grid-cols-6 w-full">
                              <div v-if="editForm.is_active === false" class="col-span-6 w-full">
                                <button
                                  class="group relative w-32 float-right flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600 transition duration-150 ease-in-out"
                                  @click.prevent="activateShipping"
                                >
                                  <span>Activate</span>
                                </button>
                              </div>
                              <div class="col-span-6 w-full">
                                <b-tooltip
                                  label="Describe shipping"
                                  class="w-full"
                                  type="is-info"
                                  position="is-bottom"
                                >
                                  <textarea
                                    id="shipping-description"
                                    v-model="editForm.description"
                                    placeholder="Shipping description"
                                    class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                  />
                                </b-tooltip>
                              </div>
                              <div class="col-span-6 w-full">
                                <b-tooltip
                                  label="Shipping price"
                                  class="w-full"
                                  type="is-info"
                                  position="is-bottom"
                                >
                                  <input
                                    id="price"
                                    v-model="editForm.price"
                                    placeholder="price"
                                    class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                  >
                                </b-tooltip>
                              </div>
                              <div class="relative col-span-6 w-full flex flex-col items-center mt-2">
                                <div
                                  class="w-full mb-2 flex flex-row appearance-none bg-white text-gray-600 border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                  @click="showProductsModalEdit"
                                >
                                  <span class="text-gray-600 font-medium">Select products</span>
                                  <span v-if="editForm.product_ids.length !== 0">({{ editForm.product_ids.length }})</span>
                                  <div
                                    class="absolute top-0 mt-2 right-0 px-2 text-gray-700 text-lg font-semibold"
                                  >
                                    <span>+</span>
                                  </div>
                                </div>
                                <b-modal
                                  :active.sync="showProductsEdit"
                                  has-modal-card
                                  trap-focus
                                  :destroy-on-hide="false"
                                  aria-role="dialog"
                                  aria-modal
                                >
                                  <div class="modal-card">
                                    <div
                                      id="dropdown"
                                      class="w-full block p-3 shadow-md modal-card-body bg-gray-200"
                                    >
                                      <div class="flex flex-row w-full mb-2">
                                        <div class="w-full flex flex-col items-center">
                                          <span
                                            class="text-xl text-gray-600 font-semibold"
                                          >Select products</span>
                                        </div>
                                        <span
                                          class="rounded px-2 py-1 bg-red-700 text-white float-right cursor-pointer"
                                          @click="showProductsModalEdit"
                                        >Done</span>
                                      </div>
                                      <div class="flex flex-row justify-between">
                                        <label class="flex flex-row justify-start items-start">
                                          <div
                                            class="select-none cursor-pointer mr-1 uppercase text-sm font-semibold"
                                          >{{ selectAllText }}</div>
                                          <div
                                            class="bg-white border-2 rounded border-gray-800 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
                                          >
                                            <input
                                              id="selectAll"
                                              v-model="allSelected"
                                              type="checkbox"
                                              class="opacity-0 absolute cursor-pointer"
                                              @click="selectAll"
                                            >
                                            <svg
                                              class="fill-current hidden w-4 h-4 text-red-700 pointer-events-none"
                                              viewBox="0 0 20 20"
                                            >
                                              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                            </svg>
                                          </div>
                                        </label>
                                        <div
                                          class="text-sm font-semibold"
                                        >
                                          {{ editForm.product_ids.length }} SELECTED
                                        </div>
                                      </div>
                                      <ul id="customScroll" data-simplebar-auto-hide="false">
                                        <li
                                          v-for="(product, index) in products"
                                          :key="index"
                                          class="border border-t-0 border-r-0 border-l-0 border-b"
                                        >
                                          <label class="flex justify-start items-start">
                                            <div
                                              class="bg-white border-2 rounded border-gray-800 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
                                            >
                                              <input
                                                :id="index"
                                                v-model="editForm.product_ids"
                                                type="checkbox"
                                                :value="product.product_id"
                                                class="opacity-0 absolute cursor-pointer"
                                              >
                                              <svg
                                                class="fill-current hidden w-4 h-4 text-red-700 pointer-events-none"
                                                viewBox="0 0 20 20"
                                              >
                                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                              </svg>
                                            </div>
                                            <div
                                              class="select-none cursor-pointer"
                                            >{{ product.name }}</div>
                                          </label>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </b-modal>
                              </div>
                              <div class="col-span-6 mt-6 mb-2">
                                <div v-if="error" class="w-full bg-red-200 p-2 rounded m-2">
                                  <span
                                    class="text-xs text-red-700 font-semibold font-ubuntu"
                                  >{{ errorMessage }}</span>
                                </div>
                                <div v-if="success" class="w-full bg-blue-100 p-2 rounded mb-2">
                                  <span class="text-xs text-blue-500 font-semibold font-ubuntu">{{ message }}</span>
                                </div>
                                <button
                                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-800 hover:bg-red-600 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-600 transition duration-150 ease-in-out"
                                  @click.prevent="editShipping(shippingObj.store_shipping_id)"
                                >
                                  <span v-if="isLoading">Updating...</span>
                                  <span v-else>Update addon</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </b-modal>
              </div>
              <div class="w-full">
                <button
                  class="py-2 px-4 float-right shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                  @click="toggleState"
                >
                  <span class="text-base font-bold mr-2">+</span>
                  <span>Create shipping options</span>
                </button>
              </div>
            </div>
          </div>
          <div
            class="w-full flex flex-col items-center"
            :class="showShippingForm ? 'block' : 'hidden'"
          >
            <div class="w-full ml-2 md:absolute md:top-0 md:mt-2">
              <button
                class="py-2 px-4 float-left border border-transparent text-xl leading-5 font-semibold text-gray-700 focus:outline-none transition duration-150 ease-in-out"
                @click="toggleState"
              >
                <span class>
                  <font-awesome-icon :icon="['fa', 'arrow-left']" />
                </span>
              </button>
            </div>
            <div class="lg:w-3/4 md:w-3/4 lg:p-40 w-full p-5 lg:pt-5">
              <p class="flex flex-row row-gap-3 text-xl font-semibold mb-3">
                <img src="/plus.svg" alt class="h-6 w-6 mt-1 mr-2"> Create shipping option
              </p>

              <div class="w-full flex flex-col bg-white rounded shadow-lg my-2 p-2">
                <div class="grid grid-cols-6 w-full">
                  <div class="col-span-6 w-full">
                    <b-tooltip
                      label="Describe the addon"
                      class="w-full"
                      type="is-info"
                      position="is-left"
                    >
                      <textarea
                        id="shipping-description"
                        v-model="form.description"
                        placeholder="Shipping description"
                        class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                    </b-tooltip>
                  </div>
                  <div class="col-span-6 w-full">
                    <b-tooltip
                      label="Shipping price"
                      class="w-full"
                      type="is-info"
                      position="is-left"
                    >
                      <input
                        id="price"
                        v-model="form.price"
                        placeholder="Price of shipping"
                        class="mt-2 form-input block w-full py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      >
                    </b-tooltip>
                  </div>
                  <div class="relative col-span-6 w-full flex flex-col items-center mt-2">
                    <div
                      class="col-span-6 w-full mt-2 flex flex-row appearance-none bg-white text-gray-600 border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      @click="showProductsModal"
                    >
                      <span class="text-gray-600 font-medium">Select products</span>
                      <span v-if="form.product_ids.length !== 0">({{ form.product_ids.length }})</span>
                      <div
                        class="absolute top-0 mt-4 right-0 px-2 text-gray-700 text-lg font-semibold"
                      >
                        <span>+</span>
                      </div>
                    </div>
                  </div>
                  <div class="relative col-span-6 w-full flex flex-col items-center mt-2">
                    <div v-if="error" class="col-span-6 w-full bg-red-200 p-2 rounded m-2">
                      <span
                        class="text-xs text-red-700 font-semibold font-ubuntu"
                      >{{ errorMessage }}</span>
                    </div>
                    <div class="col-span-6 w-full py-3">
                      <button
                        :disabled="incomplete"
                        class="w-full py-2 px-4 shadow-xl border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-700 disabled:cursor-not-allowed hover:bg-red-600 focus:outline-none focus:shadow-outline-blue active:bg-gray-800 transition duration-150 ease-in-out"
                        @click="createShipping"
                      >
                        <span v-if="isLoading">Creating...</span>
                        <span v-else>Create shipping</span>
                      </button>
                    </div>
                  </div>
                </div>
                <b-modal
                  :active.sync="showProducts"
                  has-modal-card
                  trap-focus
                  :destroy-on-hide="false"
                  aria-role="dialog"
                  aria-modal
                >
                  <div class="modal-card">
                    <div
                      id="dropdown"
                      class="w-full block p-3 shadow-md modal-card-body bg-gray-200"
                    >
                      <div class="flex flex-row w-full mb-2">
                        <div class="w-full flex flex-col items-center">
                          <span class="text-xl text-gray-600 font-semibold">Select products</span>
                        </div>
                        <span
                          class="rounded px-2 py-1 bg-red-700 text-white float-right cursor-pointer"
                          @click="showProductsModal"
                        >Done</span>
                      </div>
                      <div class="flex flex-row justify-between">
                        <label class="flex flex-row justify-start items-start">
                          <div
                            class="select-none cursor-pointer mr-1 uppercase text-sm font-semibold"
                          >{{ selectAllText }}</div>
                          <div
                            class="bg-white border-2 rounded border-gray-800 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
                          >
                            <input
                              id="selectAll"
                              v-model="allSelected"
                              type="checkbox"
                              class="opacity-0 absolute cursor-pointer"
                              @click="selectAll"
                            >
                            <svg
                              class="fill-current hidden w-4 h-4 text-red-700 pointer-events-none"
                              viewBox="0 0 20 20"
                            >
                              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                            </svg>
                          </div>
                        </label>
                        <div
                          class="text-sm font-semibold"
                        >
                          {{ form.product_ids.length }} SELECTED
                        </div>
                      </div>
                      <ul id="customScroll" data-simplebar-auto-hide="false">
                        <li
                          v-for="(product, index) in products"
                          :key="index"
                          class="border border-t-0 border-r-0 border-l-0 border-b"
                        >
                          <label class="flex justify-start items-start">
                            <div
                              class="bg-white border-2 rounded border-gray-800 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
                            >
                              <input
                                :id="index"
                                v-model="form.product_ids"
                                type="checkbox"
                                :value="product.product_id"
                                class="opacity-0 absolute cursor-pointer"
                              >
                              <svg
                                class="fill-current hidden w-4 h-4 text-red-700 pointer-events-none"
                                viewBox="0 0 20 20"
                              >
                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                              </svg>
                            </div>
                            <div class="select-none cursor-pointer">{{ product.name }}</div>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </b-modal>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Sidenav from '../../components/sidenav';
import Paginator from '../../components/pagination';
export default {
  layout: 'none',
  components: {
    Sidenav,
    Paginator
  },
  data () {
    return {
      dropDownStateId: '',
      isLoading: false,
      incomplete: false,
      showShippingForm: false,
      makeModal: false,
      current_page: 1,
      limit: 50,
      products: {},
      form: {
        description: '',
        price: '',
        store_id: '',
        product_ids: []
      },
      editForm: {
        description: '',
        price: '',
        store_id: '',
        product_ids: [],
        is_active: null,
        updated_at: ''
      },
      shippingData: [],
      shippingObj: {},
      error: false,
      errorMessage: '',
      success: false,
      message: '',
      showProducts: false,
      showProductsEdit: false,
      allSelected: false,
      selectAllText: 'Select All'
    };
  },

  computed: {
    ...mapState(['token', 'store', 'shipping'])
  },

  async created () {
    const data = await this.$axios.get(
      `/stores/${this.store.store_id}/shippings`,
      {
        headers: {
          'x-access-token': this.token
        }
      }
    );

    this.shippingData = data.data.shipping;

    const productResponse = await this.$axios.get(
      `/onboarding/stores/${this.store.store_id}/products`,
      {
        headers: {
          'x-access-token': this.token
        }
      }
    );

    this.products = productResponse.data.products;

    await this.$axios
      .get(
        `/stores/${this.store.store_id}/shipping?limit=${this.limit}&offset=0`,
        {
          headers: {
            'x-access-token': this.token
          }
        }
      )
      .then((shipping) => {
        this.$store.commit('setShipping', shipping.data.shipping);
      })
      .catch(() => {
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: "There's an error fetching shipping at this time.",
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      });
    this.form.store_id = this.store.store_id;
  },

  methods: {
    showProductsModal () {
      this.showProducts = !this.showProducts;
    },

    showProductsModalEdit () {
      this.showProductsEdit = !this.showProductsEdit;
    },

    selectAll () {
      this.allSelected = !this.allSelected;
      this.selectAllText =
        this.selectAllText == 'Select All' ? 'Clear All' : 'Select All';
      if (this.showProductsEdit) {
        if (this.allSelected) {
          for (const item in this.products) {
            this.editForm.product_ids.push(this.products[item].product_id);
          }
        } else {
          this.editForm.product_ids = [];
        }
      }

      if (this.showProducts) {
        if (this.allSelected) {
          for (const item in this.products) {
            this.form.product_ids.push(this.products[item].product_id);
          }
        } else {
          this.form.product_ids = [];
        }
      }
    },

    toggleState () {
      this.showShippingForm = !this.showShippingForm;
    },

    toggleDropDown (id) {
      this.dropDownStateId === '' ? this.dropDownStateId = id : this.dropDownStateId = '';
    },

    getCurrentTopAndBottomItem () {
      const len = this.shipping.length;
      const top = this.shipping[len - len].ui_order;
      const bottom = this.shipping[len - 1].ui_order;

      return { top, bottom };
    },

    async moveItemTo (position, store_shipping_id) {
      try {
        const { top, bottom } = this.getCurrentTopAndBottomItem();
        await this.$axios.put(
          `/stores/${this.store.store_id}/shipping/${store_shipping_id}`,
          { ui_order: position == 'top' ? top + 1 : bottom - 1 },
          {
            headers: {
              'x-access-token': this.token
            }
          }
        );

        // update localStorage after updating item
        this.updateLocalStorage();
        this.dropDownStateId = '';
      } catch (error) {
        console.error(error);
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'Error: unable to move item.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    findIndex (id) {
      let item;
      this.dropdownState.forEach((x) => {
        if (x.id === id) {
          item = x;
        }
      });
      return item.status;
    },

    async updateLocalStorage () {
      const shipping = await this.$axios.get(
        `/stores/${this.store.store_id}/shipping?limit=${
          this.limit
        }&offset=${(this.current_page - 1) * this.limit}`,
        {
          headers: {
            'x-access-token': this.token
          }
        }
      );
      this.$store.commit('setShipping', shipping.data.shipping);
    },

    validateFormFields () {
      if (this.form.description === '' || this.form.price === '') {
        this.error = true;
        this.errorMessage = 'All form fields are required';
        this.isLoading = false;
        return false;
      }

      return true;
    },

    openModal (shipping) {
      this.makeModal = true;
      this.shippingObj = shipping;
      this.editForm.description = shipping.description;
      this.editForm.store_id = shipping.store_id;
      this.editForm.price = shipping.price;
      this.editForm.is_active = shipping.is_active;
      this.editForm.product_ids = shipping.product_ids;
    },

    activateShipping () {
      this.editForm.is_active = !this.editForm.is_active;
      this.success = true;
      this.message = 'Click the update button to effect you changes';
    },

    async editShipping (store_shipping_id) {
      this.isLoading = true;
      const date = new Date();
      try {
        this.editForm.updated_at = date.toISOString();
        await this.$axios.put(
          `/stores/${this.store.store_id}/shipping/${store_shipping_id}`,
          this.editForm,
          {
            headers: {
              'x-access-token': this.token
            }
          }
        );

        // update localStorage after updating item
        this.updateLocalStorage();
        this.makeModal = false;
        this.isLoading = false;
        this.success = false;
      } catch (error) {
        this.isLoading = false;
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'unable to update shipping option.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    async deactivateShipping (store_shipping_id) {
      try {
        // deactivate single record from database
        await this.$axios.put(
          `/stores/${this.store.store_id}/shipping/${store_shipping_id}`, { is_active: false },
          {
            headers: {
              'x-access-token': this.token
            }
          }
        );

        // update localStorage after deactivating item
        this.updateLocalStorage();
      } catch {
        return this.$buefy.notification.open({
          duration: 2000,
          closable: false,
          animation: 'fade',
          message: 'unable to deactivate shipping.',
          position: 'is-bottom-right',
          type: 'is-primary'
        });
      }
    },

    async refetchShipping (page) {
      await this.$axios
        .get(
          `/stores/${this.store.store_id}/shipping?limit=${
            this.limit
          }&offset=${(page - 1) * this.limit}`,
          {
            headers: {
              'x-access-token': this.token
            }
          }
        )
        .then((shipping) => {
          this.current_page = page;
          this.$store.commit('setShipping', shipping.data.shipping);
        })
        .catch(() => {
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: "There's an error fetching shipping records at this time.",
            position: 'is-bottom-right',
            type: 'is-primary'
          });
        });
    },

    async createShipping () {
      this.isLoading = true;
      const validate = this.validateFormFields();

      if (validate) {
        try {
          // set shipping to all products
          if (this.form.product_ids.length < 1) {
            this.products.forEach((item) => {
              this.form.product_ids.push(item.product_id);
            });
          }

          await this.$axios.post(
          `/stores/${this.store.store_id}/shipping`,
          this.form,
          {
            headers: {
              'x-access-token': this.token
            }
          }
          );

          // update localStorage after updating item
          this.updateLocalStorage();

          this.isLoading = false;
          this.error = false;
          return this.$buefy.notification.open({
            duration: 2000,
            closable: false,
            animation: 'fade',
            message: 'Shipping option created successfully.',
            position: 'is-bottom-right',
            type: 'is-success'
          });
        } catch (error) {
          this.error = true;
          this.errorMessage = 'An unexpected error occurred';
          this.isLoading = false;
          console.log(error);
        } finally {
          this.form.description = '';
          this.form.price = '';
          this.form.is_active = null;
          this.form.product_ids = [];
        }
      }
    }
  }
};
</script>

<style>
input:checked + svg {
  display: block;
}
</style>
