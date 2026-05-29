using {apps.dflc.expensemanager.entities as entities} from '../../db/entities';

@path    : '/apps/dflc/cap/ExpenseManager/Liability'
@requires: 'authenticated-user'

service LiabilityService {

    @odata.draft.enabled

    // @restrict: [

    //     {
    //         grant: 'READ',
    //         where: `Person.createdBy = $user or
    //                 exists (
    //                     select 1
    //                     from apps.dflc.expensemanager.entities.Shares as S
    //                     inner join apps.dflc.expensemanager.entities.Entities as E
    //                         on E.Share_ID = S.ID
    //                     where
    //                         S.Person_ID = Person.ID and
    //                         S.User = $user and
    //                         E.Entity = 9 and
    //                         E.Permission <> null 
    //                 )`
    //     },

    //     {grant: [
    //         'CREATE',
    //         'UPDATE',
    //         'DELETE'
    //     ]}

    // ]

    entity Liabilities as projection on entities.Liabilities;


    action   CreateLiability(PersonId: UUID,
                             Name: String,
                             OriginalAmount: Decimal,
                             Currency: String)              returns entities.ActionResult;

    action   PayLiability(LiabilityId: UUID,
                          Amount: Decimal,
                          Notes: String)                    returns entities.ActionResult;

    action   CloseLiability(LiabilityId: UUID)              returns entities.ActionResult;

    action   RenegotiateLiability(LiabilityId: UUID,
                                  NewBalance: Decimal,
                                  NewInstallments: Integer,
                                  NewInterestRate: Decimal) returns entities.ActionResult;

    function Dashboard(PersonId: UUID)                      returns entities.ActionResult;

    function Analytics(PersonId: UUID)                      returns entities.ActionResult;

    function PaymentSchedule(LiabilityId: UUID)             returns entities.ActionResult;

    function FutureImpact(PersonId: UUID)                   returns entities.ActionResult;

}

annotate LiabilityService with @requires: [
    //'authenticated-user',
    'ExpenseManagerUser',
    //'any'
];
